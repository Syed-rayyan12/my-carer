import { membershipAccess } from '../membership/plan-policy.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './organisations.public.repository.js';
import * as validation from './organisations.public.validation.js';

export async function getOrganisations(context: OperationInput) {
  const category = validation.organisationCategorySchema.parse(context.query.category);
  const records = await repository.findManyUser({
    where: {
      status: 'ACTIVE',
      accountCategory: category ?? { in: ['CARE_HOME', 'CARE_AGENCY'] },
      organisation: { isNot: null },
    },
    select: {
      id: true,
      accountCategory: true,
      organisation: true,
      reviewsReceived: {
        where: { visible: true },
        select: { rating: true, body: true, response: true, createdAt: true },
      },
      membership: { include: { plan: true } },
    },
    take: 200,
  });
  const data = records
    .map((user) => {
      const p = user.organisation!;
      const e = membershipAccess(user.membership).entitlements;
      const agency = user.accountCategory === 'CARE_AGENCY';
      const gallery = Array.isArray(p.gallery) ? p.gallery : [];
      return {
        id: user.id,
        reviews: user.reviewsReceived,
        category: user.accountCategory,
        name: p.name,
        address: p.address,
        postcode: p.postcode,
        phone: p.phone,
        website: p.website,
        coverage: p.coverage,
        description: p.description,
        cqcRating: p.cqcVerifiedAt ? p.cqcRating : null,
        cqcVerifiedAt: p.cqcVerifiedAt,
        cqcReference: p.cqcVerifiedAt ? p.cqcReference : null,
        gallery: agency
          ? e.team === true
            ? gallery
            : []
          : gallery.slice(
              0,
              typeof e.galleryLimit === 'number'
                ? e.galleryLimit
                : e.galleryLimit === null
                  ? undefined
                  : 0,
            ),
        services: agency || e.serviceDetails === true ? p.services : '',
        feeRange: e.feeRange === true ? p.feeRange : '',
        team: e.team === true ? p.team : '',
        virtualTour: e.virtualTour === true ? p.virtualTour : '',
        branches: e.multiBranch === true ? p.branches : [],
        agencyBadge: e.agencyBadge === true,
        featured: e.featured === true,
        carousel: e.carousel === true,
      };
    })
    .filter((p) => p.name)
    .sort((a, b) => Number(b.featured) - Number(a.featured));
  return {
    statusCode: 200,
    body: { data: context.query.featured === 'true' ? data.filter((p) => p.carousel) : data },
  };
}
