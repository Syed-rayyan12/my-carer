export type GetPlansResponse = Awaited<
  ReturnType<typeof import('./pricing.public.service.js').getPlans>
>['body'];
