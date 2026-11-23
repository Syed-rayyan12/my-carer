import { ApiError } from '../../utils/ApiError.js';
import { accessFor } from '../membership/plans.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './organisations.repository.js';
import * as validation from './organisations.validation.js';

export async function getOrganisation(context: OperationInput) {
  const access = await accessFor(context.user!.id);
  if (!['CARE_HOME', 'CARE_AGENCY'].includes(access.membership?.plan.category ?? ''))
    throw new ApiError(403, 'An organisation package is required');
  return {
    statusCode: 200,
    body: {
      data: await repository.findUniqueOrganisationProfile({ where: { userId: context.user!.id } }),
    },
  };
}
export async function patchOrganisation(context: OperationInput) {
  const userId = context.user!.id;
  const access = await accessFor(userId);
  if (
    !access.active ||
    !['CARE_HOME', 'CARE_AGENCY'].includes(access.membership?.plan.category ?? '')
  )
    throw new ApiError(403, 'An active organisation package is required');
  const data = validation.organisationUpdateSchema.parse(context.body);
  const e = access.entitlements;
  const galleryLimit =
    access.membership!.plan.category === 'CARE_AGENCY'
      ? e.team === true
        ? null
        : 0
      : e.galleryLimit;
  if (typeof galleryLimit === 'number' && data.gallery.length > galleryLimit)
    throw new ApiError(403, `Your package allows ${galleryLimit} gallery photos.`);
  for (const [field, feature] of [
    ['services', 'serviceDetails'],
    ['feeRange', 'feeRange'],
    ['virtualTour', 'virtualTour'],
    ['team', 'team'],
  ] as const) {
    if (
      data[field] &&
      e[feature] !== true &&
      !(field === 'services' && access.membership!.plan.category === 'CARE_AGENCY')
    )
      throw new ApiError(403, `Your package does not include ${field}.`);
  }
  if (data.branches.length && e.multiBranch !== true)
    throw new ApiError(403, 'Multi-branch management requires Enterprise');
  return {
    statusCode: 200,
    body: {
      data: await repository.upsertOrganisationProfile({
        where: { userId },
        create: { userId, ...data },
        update: data,
      }),
    },
  };
}
