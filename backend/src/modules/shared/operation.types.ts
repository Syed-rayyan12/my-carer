import type { Request } from 'express';
export type OperationInput = {
  user: NonNullable<Request['auth']>['user'] | undefined;
  body: unknown;
  params: Request['params'];
  query: Request['query'];
};
