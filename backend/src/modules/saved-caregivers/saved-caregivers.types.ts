export type GetSavedResponse = Awaited<
  ReturnType<typeof import('./saved-caregivers.service.js').getSaved>
>['body'];
export type PostSavedResponse = Awaited<
  ReturnType<typeof import('./saved-caregivers.service.js').postSaved>
>['body'];
export type DeleteSavedByIdResponse = Awaited<
  ReturnType<typeof import('./saved-caregivers.service.js').deleteSavedById>
>['body'];

export type SaveCaregiverSchemaInput = import('zod').input<
  typeof import('./saved-caregivers.validation.js').saveCaregiverSchema
>;
export type SavedCaregiverIdSchemaInput = import('zod').input<
  typeof import('./saved-caregivers.validation.js').savedCaregiverIdSchema
>;
