import { prisma } from '../../config/db.js';
export const listPlans = (includeFamilies = false) =>
  prisma.pricingPlan.findMany({
    where: { active: true, ...(includeFamilies ? {} : { category: { not: 'CARE_SEEKER' } }) },
    orderBy: { displayOrder: 'asc' },
  });
