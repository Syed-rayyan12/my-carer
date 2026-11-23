export type GetOrganisationResponse = Awaited<
  ReturnType<typeof import('./organisations.service.js').getOrganisation>
>['body'];
export type PatchOrganisationResponse = Awaited<
  ReturnType<typeof import('./organisations.service.js').patchOrganisation>
>['body'];

export type SafeUrlInput = import('zod').input<
  typeof import('./organisations.validation.js').safeUrl
>;
export type SchemaInput = import('zod').input<
  typeof import('./organisations.validation.js').schema
>;
export type OrganisationUpdateSchemaInput = import('zod').input<
  typeof import('./organisations.validation.js').organisationUpdateSchema
>;
