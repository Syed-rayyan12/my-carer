export type AccountsQueryInput = import('zod').input<
  typeof import('./admin-pages.validation.js').accountsQuery
>;
export type RequestsQueryInput = import('zod').input<
  typeof import('./admin-pages.validation.js').requestsQuery
>;
export type ReviewsQueryInput = import('zod').input<
  typeof import('./admin-pages.validation.js').reviewsQuery
>;

export type AdminOverviewResponse = Awaited<
  ReturnType<typeof import('./admin-pages.service.js').getOverview>
>;
export type AdminAccountsResponse = Awaited<
  ReturnType<typeof import('./admin-pages.service.js').getAccounts>
>;
