export type GetOrganisationsResponse = Awaited<
  ReturnType<typeof import('./organisations.public.service.js').getOrganisations>
>['body'];

export type OrganisationCategorySchemaInput = import('zod').input<
  typeof import('./organisations.public.validation.js').organisationCategorySchema
>;
