export type GetVerificationsResponse = Awaited<
  ReturnType<typeof import('./verifications.service.js').getVerifications>
>['body'];
export type PostVerificationsResponse = Awaited<
  ReturnType<typeof import('./verifications.service.js').postVerifications>
>['body'];

export type SubmitVerificationSchemaInput = import('zod').input<
  typeof import('./verifications.validation.js').submitVerificationSchema
>;
