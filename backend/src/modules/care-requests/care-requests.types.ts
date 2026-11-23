export type GetRequestsResponse = Awaited<
  ReturnType<typeof import('./care-requests.service.js').getRequests>
>['body'];
export type PostRequestsResponse = Awaited<
  ReturnType<typeof import('./care-requests.service.js').postRequests>
>['body'];
export type PatchRequestsByIdResponse = Awaited<
  ReturnType<typeof import('./care-requests.service.js').patchRequestsById>
>['body'];

export type RequestSchemaInput = import('zod').input<
  typeof import('./care-requests.validation.js').requestSchema
>;
export type CreateRequestSchemaInput = import('zod').input<
  typeof import('./care-requests.validation.js').createRequestSchema
>;
export type RequestIdSchemaInput = import('zod').input<
  typeof import('./care-requests.validation.js').requestIdSchema
>;
export type UpdateRequestSchemaInput = import('zod').input<
  typeof import('./care-requests.validation.js').updateRequestSchema
>;
export type RequestIdQueryInput = import('zod').input<
  typeof import('./care-requests.validation.js').requestIdQuery
>;
