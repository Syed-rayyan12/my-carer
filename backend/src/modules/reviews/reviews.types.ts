export type GetReviewsResponse = Awaited<
  ReturnType<typeof import('./reviews.service.js').getReviews>
>['body'];
export type PostReviewsResponse = Awaited<
  ReturnType<typeof import('./reviews.service.js').postReviews>
>['body'];
export type PatchReviewsByIdResponseResponse = Awaited<
  ReturnType<typeof import('./reviews.service.js').patchReviewsByIdResponse>
>['body'];
export type PostReviewsByIdDisputeResponse = Awaited<
  ReturnType<typeof import('./reviews.service.js').postReviewsByIdDispute>
>['body'];

export type CreateReviewSchemaInput = import('zod').input<
  typeof import('./reviews.validation.js').createReviewSchema
>;
export type ResponseReviewIdSchemaInput = import('zod').input<
  typeof import('./reviews.validation.js').responseReviewIdSchema
>;
export type ReviewResponseSchemaInput = import('zod').input<
  typeof import('./reviews.validation.js').reviewResponseSchema
>;
export type DisputeReviewIdSchemaInput = import('zod').input<
  typeof import('./reviews.validation.js').disputeReviewIdSchema
>;
export type ReviewDisputeSchemaInput = import('zod').input<
  typeof import('./reviews.validation.js').reviewDisputeSchema
>;
