export type GetOpenRequestsResponse = Awaited<
  ReturnType<typeof import('./care-requests.public.service.js').getOpenRequests>
>['body'];
