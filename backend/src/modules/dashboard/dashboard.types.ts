export type OverviewResponse = Awaited<
  ReturnType<typeof import('./dashboard.service.js').getOverview>
>;
