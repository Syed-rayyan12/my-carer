export type GetMembershipResponse = Awaited<
  ReturnType<typeof import('./membership.service.js').getMembership>
>['body'];
export type PostMembershipRequestResponse = Awaited<
  ReturnType<typeof import('./membership.service.js').postMembershipRequest>
>['body'];
export type PostMembershipCancelResponse = Awaited<
  ReturnType<typeof import('./membership.service.js').postMembershipCancel>
>['body'];
export type PostMembershipChangeResponse = Awaited<
  ReturnType<typeof import('./membership.service.js').postMembershipChange>
>['body'];

export type ChangeMembershipSchemaInput = import('zod').input<
  typeof import('./membership.validation.js').changeMembershipSchema
>;
