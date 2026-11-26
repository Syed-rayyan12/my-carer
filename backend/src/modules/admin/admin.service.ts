import { ApiError } from '../../utils/ApiError.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './admin.repository.js';
import * as validation from './admin.validation.js';
import { randomUUID } from 'node:crypto';
export async function patchAdminMembershipsById(context: OperationInput) {
  const userId = validation.membershipUserIdSchema.parse(context.params.id);
  const data = validation.activateMembershipSchema.parse(context.body);
  const target = await repository.findUniqueUser({ where: { id: userId } });
  if (!target || target.role === 'ADMIN' || target.status !== 'ACTIVE')
    throw new ApiError(409, 'Activate a care account before membership');
  const existing = await repository.findUniqueMembership({ where: { userId } });
  if (!existing || existing.pricePence === 0)
    throw new ApiError(409, 'This account has no paid package to activate');
  if (existing.stripeSubscriptionId || existing.stripeCheckoutId)
    throw new ApiError(409, 'Stripe manages this membership. Use Stripe Billing to change it.');
  const date = new Date(data.paidThrough);
  if (date <= new Date() || date.getTime() > Date.now() + 367 * 86400000)
    throw new ApiError(400, 'Paid-through date must be within the next 367 days');
  const membership = {
    status: 'ACTIVE',
    paidThrough: date,
    paymentReference: data.paymentReference,
  };
  return {
    statusCode: 200,
    body: {
      data: await repository.updateMembership({
        where: { userId },
        data: membership,
      }),
    },
  };
}
export async function patchAdminVerificationsById(context: OperationInput) {
  const data = validation.verificationDecisionSchema.parse(context.body);
  return {
    statusCode: 200,
    body: {
      data: await repository.updateVerification({
        where: { id: validation.verificationIdSchema.parse(context.params.id) },
        data,
      }),
    },
  };
}
export async function patchAdminReviewsById(context: OperationInput) {
  const data = validation.reviewVisibilitySchema.parse(context.body);
  return {
    statusCode: 200,
    body: {
      data: await repository.updateReview({
        where: { id: validation.reviewIdSchema.parse(context.params.id) },
        data,
      }),
    },
  };
}
export async function patchOrganisationsByIdCqc(context: OperationInput) {
  const userId = validation.organisationUserIdSchema.parse(context.params.id);
  const input = validation.cqcVerificationSchema.parse(context.body);
  const organisation = await repository.findUniqueOrganisationProfile({ where: { userId } });
  if (!organisation) throw new ApiError(404, 'Organisation not found');
  return {
    statusCode: 200,
    body: {
      data: await repository.updateOrganisationProfile({
        where: { userId },
        data: { cqcRating: input.rating, cqcReference: input.sourceUrl, cqcVerifiedAt: new Date() },
      }),
    },
  };
}
export async function patchUsersByIdProfile(context: OperationInput) {
  const id = validation.userIdSchema.parse(context.params.id);
  const data = validation.updateUserProfileSchema.parse(context.body);
  const user = await repository.findUniqueUser({ where: { id } });
  if (!user || user.role === 'ADMIN') throw new ApiError(404, 'Care account not found');
  await repository.transaction(async (tx) => {
    await tx.lockUser(id);
    await tx.updateUser({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        profile: {
          upsert: {
            create: { phone: data.phone, location: data.location },
            update: { phone: data.phone, location: data.location },
          },
        },
      },
    });
    if (user.role === 'CAREGIVER') {
      const before = await tx.findProfessional(id);
      const details = before?.details && typeof before.details === 'object' && !Array.isArray(before.details) ? { ...before.details } : {};
      if (data.availabilitySchedule) {
        const weekly = data.availabilitySchedule.weekly;
        const first = weekly.flatMap(row => row.slots)[0];
        details.availability = { ...data.availabilitySchedule, days: weekly.filter(row => row.slots.length).map(row => row.day), start: first?.start ?? '09:00', end: first?.end ?? '18:00' };
      }
      if (data.qualifications !== undefined) {
        const profile = details.profile && typeof details.profile === 'object' && !Array.isArray(details.profile) ? details.profile : {};
        const existing = Array.isArray(profile.qualifications) ? profile.qualifications : [];
        details.profile = { ...profile, qualifications: data.qualifications.split('\n').map(name => name.trim()).filter(Boolean).map(name => {
          const match = existing.find(row => row && typeof row === 'object' && !Array.isArray(row) && row.name === name);
          return match ?? { id: randomUUID(), name, institution: '', year: '', fileName: '' };
        }) };
      }
      const professional = {
        location: data.location,
        ...(data.hourlyRatePence === undefined ? {} : { hourlyRatePence: data.hourlyRatePence }),
        ...(data.availabilitySchedule ? { availability: data.availabilitySchedule.weekly.filter(row => row.slots.length).map(row => `${row.day}: ${row.slots.map(slot => `${slot.start}–${slot.end}`).join(', ')}`).join('; ') || 'Currently unavailable' } : data.availability === undefined ? {} : { availability: data.availability }),
        ...(data.services === undefined ? {} : { services: data.services }),
        ...(data.qualifications === undefined ? {} : { qualifications: data.qualifications }),
        ...(data.availabilitySchedule || data.qualifications !== undefined ? { details } : {}),
      };
      await tx.upsertProfessionalProfile({
        where: { userId: id },
        create: { userId: id, ...professional },
        update: professional,
      });
    }
  });
  return { statusCode: 200, body: { data: null } };
}
