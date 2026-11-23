export type SessionUser = ReturnType<typeof import('./auth.service.js').publicUser>;
export type AuthenticatedSession = Awaited<
  ReturnType<typeof import('./auth.service.js').authenticate>
>;
export type SignupRequest = import('./auth.validation.js').SignupInput;
export type LoginRequest = import('./auth.validation.js').LoginInput;
