import pino from 'pino';
import { env } from './env.js';

const scrub = (value: string) =>
  value
    .replaceAll(env.DATABASE_URL, '[REDACTED_DATABASE_URL]')
    .replace(/(postgres(?:ql)?:\/\/)[^\s@]+@/gi, '$1[REDACTED]@');

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'password',
      'token',
      'secret',
      'DATABASE_URL',
      '*.password',
      '*.token',
      '*.secret',
      '*.DATABASE_URL',
    ],
    censor: '[REDACTED]',
  },
  serializers: {
    err: (error: unknown) => {
      if (!(error instanceof Error)) {
        return {
          type: typeof error,
          message: scrub(typeof error === 'string' ? error : 'Non-Error value thrown'),
        };
      }
      const serialized = pino.stdSerializers.err(error);
      return {
        ...serialized,
        message: scrub(serialized.message),
        stack: serialized.stack ? scrub(serialized.stack) : undefined,
      };
    },
  },
  ...(env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard' },
        },
      }
    : {}),
});
