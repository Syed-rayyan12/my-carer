export type GetMessagesResponse = Awaited<
  ReturnType<typeof import('./messages.service.js').getMessages>
>['body'];
export type PostMessagesResponse = Awaited<
  ReturnType<typeof import('./messages.service.js').postMessages>
>['body'];

export type SendMessageSchemaInput = import('zod').input<
  typeof import('./messages.validation.js').sendMessageSchema
>;
