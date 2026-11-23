import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { ZodError } from 'zod';

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new ApiError(404, 'Route not found'));
};

export const errorHandler: ErrorRequestHandler = (error: unknown, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (error instanceof ZodError) {
    statusCode = 400;
    message = error.issues
      .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
      .join('; ');
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    if (error.isOperational || env.NODE_ENV !== 'production') message = error.message;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      statusCode = 409;
      message = 'Resource already exists';
    } else if (error.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found';
    }
  } else if (error instanceof Error && 'type' in error) {
    if (error.type === 'entity.parse.failed') {
      statusCode = 400;
      message = 'Invalid JSON body';
    } else if (error.type === 'entity.too.large') {
      statusCode = 413;
      message = 'Request body too large';
    }
  }

  if (statusCode >= 500) {
    logger.error({ err: error, requestId: req.id }, 'Request failed');
    if (env.NODE_ENV !== 'production' && error instanceof Error) message = error.message;
  }

  if (res.headersSent) {
    next(error);
    return;
  }

  res.status(statusCode).json({ status: 'error', message });
};
