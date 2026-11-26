import { prisma } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requiresBillingCheckout } from './billing.policy.js';

const billingPaths = new Set([
  'GET /account', 'GET /membership', 'GET /membership/billing',
  'POST /membership/checkout', 'POST /membership/portal', 'POST /membership/cancel',
]);

export const requireCompletedBilling = asyncHandler(async (req, _res, next) => {
  if (req.auth?.user.role === 'ADMIN' ||
    billingPaths.has(`${req.method} ${req.path}`)) { next(); return; }
  const member = await prisma.membership.findUnique({
    where: { userId: req.auth!.user.id }, include: { plan: true },
  });
  if (requiresBillingCheckout(member))
    throw new ApiError(402, 'Complete Stripe Checkout for your selected package to unlock the dashboard.');
  next();
});
