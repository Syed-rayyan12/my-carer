export type GetDirectoryResponse = Awaited<
  ReturnType<typeof import('./caregivers.public.service.js').getDirectory>
>['body'];

export type DirectorySearchSchemaInput = import('zod').input<
  typeof import('./caregivers.public.validation.js').directorySearchSchema
>;
