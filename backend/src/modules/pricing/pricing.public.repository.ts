import { prisma } from '../../config/db.js';
import { planRole } from '../membership/plan-policy.js';
export const listPlans = async (includeFamilies = false) =>
  (
    await prisma.pricingPlan.findMany({
      where: { active: true, ...(includeFamilies ? {} : { category: { not: 'CARE_SEEKER' } }) },
      orderBy: { displayOrder: 'asc' },
    })
  ).map((plan) => ({ ...plan, defaultRole: planRole(plan.id) }));
