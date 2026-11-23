export type PatchProfileResponse = Awaited<
  ReturnType<typeof import('./caregivers.service.js').patchProfile>
>['body'];
export type GetProfessionalResponse = Awaited<
  ReturnType<typeof import('./caregivers.service.js').getProfessional>
>['body'];
export type PatchProfessionalResponse = Awaited<
  ReturnType<typeof import('./caregivers.service.js').patchProfessional>
>['body'];
export type GetCaregiversResponse = Awaited<
  ReturnType<typeof import('./caregivers.service.js').getCaregivers>
>['body'];

export type ProfessionalSchemaInput = import('zod').input<
  typeof import('./caregivers.validation.js').professionalSchema
>;
export type CaregiverProfileSchemaInput = import('zod').input<
  typeof import('./caregivers.validation.js').caregiverProfileSchema
>;
export type ProfessionalUpdateSchemaInput = import('zod').input<
  typeof import('./caregivers.validation.js').professionalUpdateSchema
>;
export type CaregiverSearchSchemaInput = import('zod').input<
  typeof import('./caregivers.validation.js').caregiverSearchSchema
>;
