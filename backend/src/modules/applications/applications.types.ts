export type GetApplicationsResponse = Awaited<
  ReturnType<typeof import('./applications.service.js').getApplications>
>['body'];
export type PostApplicationsResponse = Awaited<
  ReturnType<typeof import('./applications.service.js').postApplications>
>['body'];
export type PatchApplicationsByIdResponse = Awaited<
  ReturnType<typeof import('./applications.service.js').patchApplicationsById>
>['body'];
export type PatchApplicationsByIdArrangementResponse = Awaited<
  ReturnType<typeof import('./applications.service.js').patchApplicationsByIdArrangement>
>['body'];
export type PatchApplicationsByIdShortlistResponse = Awaited<
  ReturnType<typeof import('./applications.service.js').patchApplicationsByIdShortlist>
>['body'];

export type VerificationFilterSchemaInput = import('zod').input<
  typeof import('./applications.validation.js').verificationFilterSchema
>;
export type CreateApplicationSchemaInput = import('zod').input<
  typeof import('./applications.validation.js').createApplicationSchema
>;
export type ApplicationIdSchemaInput = import('zod').input<
  typeof import('./applications.validation.js').applicationIdSchema
>;
export type ApplicationStatusSchemaInput = import('zod').input<
  typeof import('./applications.validation.js').applicationStatusSchema
>;
export type ArrangementApplicationIdSchemaInput = import('zod').input<
  typeof import('./applications.validation.js').arrangementApplicationIdSchema
>;
export type ArrangementSchemaInput = import('zod').input<
  typeof import('./applications.validation.js').arrangementSchema
>;
export type ShortlistApplicationIdSchemaInput = import('zod').input<
  typeof import('./applications.validation.js').shortlistApplicationIdSchema
>;
export type ShortlistSchemaInput = import('zod').input<
  typeof import('./applications.validation.js').shortlistSchema
>;
export type RequestIdQueryInput = import('zod').input<
  typeof import('./applications.validation.js').requestIdQuery
>;
export type ApplicationStatusQueryInput = import('zod').input<
  typeof import('./applications.validation.js').applicationStatusQuery
>;
