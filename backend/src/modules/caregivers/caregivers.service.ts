import { activeMembership } from '../membership/membership-access.service.js';
import { detailsSchema } from '../shared/validation.js';
import { validateProfessionalChange } from './profile-policy.js';
import { getProfile } from '../account/account.service.js';
import { pagination, paginated } from '../shared/pagination.validation.js';
import { publicCaregiver } from './directory-policy.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './caregivers.repository.js';
import * as validation from './caregivers.validation.js';
import { identity, publicProfessional } from '../shared/user-select.js';
import { checkProfessional } from './professional-check.service.js';
import { profilePhoto } from './public-profile.js';
import { membershipAccess } from '../membership/plan-policy.js';

export async function patchProfile(context: OperationInput) {
  const { professional, ...account } = validation.caregiverProfileSchema.parse(context.body);
  const { firstName, lastName, email, dateOfBirth, ...profile } = account;
  const userId = context.user!.id;
  await checkProfessional(userId, professional);
  await repository.transaction(async (tx) => {
    const data = {
      ...profile,
      contactEmail: email || null,
      dateOfBirth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00Z`) : null,
    };
    await tx.updateUser({
      where: { id: userId },
      data: { firstName, lastName, profile: { upsert: { create: data, update: data } } },
    });
    await tx.upsertProfessionalProfile({
      where: { userId },
      create: { userId, ...professional },
      update: professional,
    });
  });
  return { statusCode: 200, body: { data: null } };
}
export async function getProfessional(context: OperationInput) {
  const section = validation.professionalSectionSchema.parse(context.query.section);
  const userId = context.user!.id;
  if (section === 'profile')
    return {
      statusCode: 200,
      body: {
        data: await repository.findUniqueProfessionalProfile({
          where: { userId },
          select: { ...publicProfessional, references: true, details: true },
        }),
      },
    };
  const record = await repository.professionalSection(userId, section);
  return { statusCode: 200, body: { data: record } };
}
export async function patchProfessional(context: OperationInput) {
  const userId = context.user!.id;
  const patch = validation.professionalUpdateSchema.parse(context.body);
  const access = await activeMembership(userId);
  await repository.patchProfessional(userId, patch, (data, before) => {
    detailsSchema.parse(data.details ?? {});
    validateProfessionalChange(data, before, access.entitlements);
  });
  return { statusCode: 200, body: { data: null } };
}
export async function getCaregivers(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  const search = validation.caregiverSearchSchema.parse(context.query.search ?? '');
  const response = paginated(
    (
      await repository.findManyUser({
        where: {
          role: 'CAREGIVER',
          status: 'ACTIVE',
          professional: {
            is: {
              OR: [
                { location: { contains: search, mode: 'insensitive' } },
                { qualifications: { contains: search, mode: 'insensitive' } },
                { services: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
        select: {
          ...identity,
          membership: { include: { plan: true } },
          professional: { select: { ...publicProfessional, details: true } },
          verifications: { where: { status: 'APPROVED' }, select: { kind: true } },
          reviewsReceived: { where: { visible: true }, select: { rating: true, body: true } },
          savedBy: { where: { userId: context.user!.id }, select: { userId: true } },
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip,
        take,
      })
    ).map(({ savedBy, ...person }) => {
      const { details, ...professional } = person.professional!;
      const safe = publicCaregiver({ ...person, professional });
      return { ...safe, photo: membershipAccess(person.membership).entitlements.bio === true ? profilePhoto(details) : '', saved: savedBy.length > 0 };
    }),
    page,
    limit,
  );
  response.data.sort((a, b) => Number(b.featured) - Number(a.featured));
  return { statusCode: 200, body: response };
}

export async function getProfilePage(context: OperationInput) {
  return { statusCode: 200, body: { data: await getProfile(context.user!.id) } };
}

export async function getApplicationProfile(context: OperationInput) {
  return { statusCode: 200, body: { data: await repository.applicationProfile(context.user!.id) } };
}
