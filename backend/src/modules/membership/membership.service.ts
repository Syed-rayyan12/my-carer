import { ApiError } from '../../utils/ApiError.js';
import { planFor } from './plans.js';
import { planRole, addCalendarMonths } from './plan-policy.js';
import type { AccountCategory } from '../../generated/prisma/client.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './membership.repository.js';
import * as validation from './membership.validation.js';

export async function getMembership(context: OperationInput) {
  return {
    statusCode: 200,
    body: {
      data: {
        plan:
          (
            await repository.findUniqueMembership({
              where: { userId: context.user!.id },
              include: { plan: true },
            })
          )?.plan ?? (await planFor(context.user!.role)),
        membership: await repository.findUniqueMembership({ where: { userId: context.user!.id } }),
        paymentMode: 'manual',
        instructions:
          'Request activation. An administrator must verify payment before activating membership.',
      },
    },
  };
}
export async function postMembershipRequest(context: OperationInput) {
  if (context.user!.role === 'ADMIN') throw new ApiError(403, 'Admins do not need a membership');
  const userId = context.user!.id;
  const existing = await repository.findUniqueMembership({ where: { userId } });
  if (existing?.pricePence === 0)
    throw new ApiError(409, 'Your free package does not require payment activation');
  if (existing?.trialEndsAt && existing.trialEndsAt > new Date())
    throw new ApiError(409, 'Your free trial is still active');
  if (existing?.paidThrough && existing.paidThrough > new Date())
    throw new ApiError(409, 'Current membership has not expired');
  return {
    statusCode: 200,
    body: {
      data: await repository.upsertMembership({
        where: { userId },
        create: {
          userId,
          planId: (await planFor(context.user!.role))!.id,
          pricePence: (await planFor(context.user!.role))!.pricePence,
        },
        update: { status: 'PENDING' },
      }),
    },
  };
}
export async function postMembershipCancel(context: OperationInput) {
  return {
    statusCode: 200,
    body: {
      data: await repository.updateMembership({
        where: { userId: context.user!.id },
        data: { status: 'CANCELLED' },
      }),
    },
  };
}
export async function postMembershipChange(context: OperationInput) {
  const input = validation.changeMembershipSchema.parse(context.body);
  const user = context.user!;
  if (user.role === 'ADMIN' || planRole(input.planId) !== user.role)
    throw new ApiError(403, 'Choose a package for your account type');
  const result = await repository.transaction(async (tx) => {
    await tx.lockUser(user.id);
    const plan = await tx.findFirstPricingPlan({ where: { id: input.planId, active: true } });
    if (!plan) throw new ApiError(400, 'Package unavailable');
    const old = await tx.findUniqueMembership({
      where: { userId: user.id },
      include: { plan: true },
    });
    if (old && old.plan.category !== plan.category)
      throw new ApiError(403, 'Package changes must stay within your registered account category');
    if (old && old.planId === plan.id && old.billingInterval === input.billingInterval) return old;
    if (old && old.pricePence > 0 && old.paidThrough && old.paidThrough > new Date())
      throw new ApiError(
        409,
        'Your paid period is still active. Change packages after it ends; cancellation retains your current access.',
      );
    if (typeof (plan.entitlements as Record<string, unknown>).jobLimit === 'number') {
      const count = await tx.countCareRequest({ where: { ownerId: user.id, status: 'OPEN' } });
      if (count > Number((plan.entitlements as Record<string, unknown>).jobLimit))
        throw new ApiError(409, 'Close excess job postings before changing to this package');
    }
    let trialStartedAt = old?.trialStartedAt ?? null;
    let trialEndsAt = old?.trialEndsAt ?? null;
    if (!trialStartedAt && plan.trialMonths > 0) {
      trialStartedAt = new Date();
      trialEndsAt = addCalendarMonths(trialStartedAt, plan.trialMonths);
    }
    const status =
      plan.pricePence === 0
        ? 'ACTIVE'
        : trialEndsAt && trialEndsAt > new Date()
          ? 'TRIAL'
          : 'PENDING';
    const data = {
      planId: plan.id,
      billingInterval: input.billingInterval,
      pricePence: input.billingInterval === 'annual' ? plan.annualPricePence : plan.pricePence,
      status,
      trialStartedAt,
      trialEndsAt,
      paidThrough: null,
      paymentReference: null,
    };
    await tx.updateUser({
      where: { id: user.id },
      data: { accountCategory: plan.category as AccountCategory },
    });
    if (['CARE_HOME', 'CARE_AGENCY'].includes(plan.category))
      await tx.upsertOrganisationProfile({
        where: { userId: user.id },
        create: { userId: user.id },
        update: {},
      });
    return tx.upsertMembership({
      where: { userId: user.id },
      create: { userId: user.id, ...data },
      update: data,
    });
  });
  return { statusCode: 200, body: { data: result } };
}
