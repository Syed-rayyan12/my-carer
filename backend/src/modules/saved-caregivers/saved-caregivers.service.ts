import { publicCaregiver } from '../caregivers/directory-policy.js';
import { pagination, paginated } from '../shared/pagination.validation.js';
import { ApiError } from '../../utils/ApiError.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './saved-caregivers.repository.js';
import * as validation from './saved-caregivers.validation.js';
import { identity, publicProfessional } from '../shared/user-select.js';

export async function getSaved(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  return {
    statusCode: 200,
    body: paginated(
      (
        await repository.findManySavedCaregiver({
          where: { userId: context.user!.id },
          skip,
          take,
          orderBy: { caregiverId: 'asc' },
          include: {
            caregiver: {
              select: {
                ...identity,
                membership: { include: { plan: true } },
                professional: { select: publicProfessional },
                verifications: { where: { status: 'APPROVED' }, select: { kind: true } },
                reviewsReceived: { where: { visible: true }, select: { rating: true } },
              },
            },
          },
        })
      ).map((row) => ({ ...row, caregiver: publicCaregiver(row.caregiver) })),
      page,
      limit,
    ),
  };
}
export async function postSaved(context: OperationInput) {
  const { caregiverId } = validation.saveCaregiverSchema.parse(context.body);
  const userId = context.user!.id;
  const target = await repository.findFirstUser({
    where: { id: caregiverId, role: 'CAREGIVER', status: 'ACTIVE' },
  });
  if (!target) throw new ApiError(404, 'Caregiver not found');
  return {
    statusCode: 200,
    body: {
      data: await repository.upsertSavedCaregiver({
        where: { userId_caregiverId: { userId, caregiverId } },
        create: { userId, caregiverId },
        update: {},
      }),
    },
  };
}
export async function deleteSavedById(context: OperationInput) {
  await repository.deleteManySavedCaregiver({
    where: {
      userId: context.user!.id,
      caregiverId: validation.savedCaregiverIdSchema.parse(context.params.id),
    },
  });
  return { statusCode: 200, body: { data: null } };
}
