import { publicCaregiver } from './directory-policy.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './caregivers.public.repository.js';
import * as validation from './caregivers.public.validation.js';
import { identity } from '../shared/user-select.js';
import { publicProfessional } from '../shared/user-select.js';
import { membershipAccess } from '../membership/plan-policy.js';
import { profilePhoto, publicProfileDetails } from './public-profile.js';
import { ApiError } from '../../utils/ApiError.js';
import { z } from 'zod';

export async function getDirectory(context: OperationInput) {
  const search = validation.directorySearchSchema.parse(context.query.search ?? '');
  const order = validation.directoryOrderSchema.parse(context.query.order);
  const limit = validation.directoryLimitSchema.parse(context.query.limit);
  return {
    statusCode: 200,
    body: {
      data: (
        await repository.findManyUser({
          where: {
            role: 'CAREGIVER',
            status: 'ACTIVE',
            professional: { isNot: null },
            ...(search
              ? {
                  OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { profile: { is: { postcode: { contains: search, mode: 'insensitive' } } } },
                    {
                      professional: {
                        is: {
                          OR: [
                            { location: { contains: search, mode: 'insensitive' } },
                            { services: { contains: search, mode: 'insensitive' } },
                            { qualifications: { contains: search, mode: 'insensitive' } },
                          ],
                        },
                      },
                    },
                  ],
                }
              : {}),
          },
          select: {
            ...identity,
            membership: { include: { plan: true } },
            professional: {
              select: {
                ...publicProfessional,
                bio: true,
                location: true,
                qualifications: true,
                hourlyRatePence: true,
                services: true,
                details: true,
              },
            },
            verifications: { where: { status: 'APPROVED' }, select: { kind: true } },
          },
          take: limit,
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        })
      )
        .map(record => {
          const { details, ...professional } = record.professional!;
          const profile = details && typeof details === 'object' && !Array.isArray(details)
            ? details.profile : null;
          const photo = profile && typeof profile === 'object' && !Array.isArray(profile)
            && typeof profile.photo === 'string' && /^\/api\/platform\/profile-photos\/[a-f0-9-]{36}$/.test(profile.photo)
            ? profile.photo : '';
          const safe = publicCaregiver({ ...record, professional });
          return { ...safe, photo: membershipAccess(record.membership).entitlements.bio === true ? photo : '' };
        })
        .sort((a, b) => order === 'latest' ? 0 : Number(b.featured) - Number(a.featured)),
    },
  };
}

export async function getDirectoryProfile(context: OperationInput) {
  const id = z.uuid().parse(context.params.id);
  const [record] = await repository.findManyUser({
    where: { id, role: 'CAREGIVER', status: 'ACTIVE', professional: { isNot: null } },
    select: {
      ...identity, membership: { include: { plan: true } },
      professional: { select: { ...publicProfessional, details: true } },
      verifications: { where: { status: 'APPROVED' }, select: { kind: true } },
      reviewsReceived: { where: { visible: true }, select: { rating: true, body: true, response: true, createdAt: true }, orderBy: { createdAt: 'desc' } },
    }, take: 1,
  });
  if (!record) throw new ApiError(404, 'Caregiver profile not found');
  const { details, ...professional } = record.professional!;
  const safe = publicCaregiver({ ...record, professional });
  const access = membershipAccess(record.membership);
  return { statusCode: 200, body: { data: { ...safe,
    photo: access.entitlements.bio === true ? profilePhoto(details) : '',
    profileDetails: publicProfileDetails(details, access.entitlements, safe.professional?.services ?? ''),
  } } };
}
