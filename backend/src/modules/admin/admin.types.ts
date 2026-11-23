export type PatchAdminMembershipsByIdResponse = Awaited<
  ReturnType<typeof import('./admin.service.js').patchAdminMembershipsById>
>['body'];
export type PatchAdminVerificationsByIdResponse = Awaited<
  ReturnType<typeof import('./admin.service.js').patchAdminVerificationsById>
>['body'];
export type PatchAdminReviewsByIdResponse = Awaited<
  ReturnType<typeof import('./admin.service.js').patchAdminReviewsById>
>['body'];
export type PatchOrganisationsByIdCqcResponse = Awaited<
  ReturnType<typeof import('./admin.service.js').patchOrganisationsByIdCqc>
>['body'];
export type PatchUsersByIdProfileResponse = Awaited<
  ReturnType<typeof import('./admin.service.js').patchUsersByIdProfile>
>['body'];

export type MembershipUserIdSchemaInput = import('zod').input<
  typeof import('./admin.validation.js').membershipUserIdSchema
>;
export type ActivateMembershipSchemaInput = import('zod').input<
  typeof import('./admin.validation.js').activateMembershipSchema
>;
export type VerificationDecisionSchemaInput = import('zod').input<
  typeof import('./admin.validation.js').verificationDecisionSchema
>;
export type VerificationIdSchemaInput = import('zod').input<
  typeof import('./admin.validation.js').verificationIdSchema
>;
export type ReviewVisibilitySchemaInput = import('zod').input<
  typeof import('./admin.validation.js').reviewVisibilitySchema
>;
export type ReviewIdSchemaInput = import('zod').input<
  typeof import('./admin.validation.js').reviewIdSchema
>;
export type OrganisationUserIdSchemaInput = import('zod').input<
  typeof import('./admin.validation.js').organisationUserIdSchema
>;
export type CqcVerificationSchemaInput = import('zod').input<
  typeof import('./admin.validation.js').cqcVerificationSchema
>;
export type UserIdSchemaInput = import('zod').input<
  typeof import('./admin.validation.js').userIdSchema
>;
export type UpdateUserProfileSchemaInput = import('zod').input<
  typeof import('./admin.validation.js').updateUserProfileSchema
>;
