export type AccountResponse = Awaited<ReturnType<typeof import('./account.service.js').getAccount>>;

export type ProfileInput = import('zod').infer<
  typeof import('./account.validation.js').profileSchema
>;
export type ProfileResponse = Awaited<ReturnType<typeof import('./account.service.js').getProfile>>;

export type ProfileSchemaInput = import('zod').input<
  typeof import('./account.validation.js').profileSchema
>;
