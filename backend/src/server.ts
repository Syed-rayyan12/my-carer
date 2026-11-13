import { createServer } from 'node:http';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { logger } from './config/logger.js';

const server = createServer(app);
let shuttingDown = false;
let exitCode = 0;

const shutdown = async (reason: string, code: number): Promise<void> => {
  exitCode = Math.max(exitCode, code);
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ reason }, 'Shutting down');

  const deadline = setTimeout(() => {
    logger.fatal('Graceful shutdown timed out');
    server.closeAllConnections();
    process.exit(1);
  }, 15000);
  deadline.unref();

  try {
    if (server.listening) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
    }
  } catch (error) {
    exitCode = 1;
    logger.error({ err: error }, 'HTTP shutdown failed');
  }

  try {
    await disconnectDatabase();
  } catch (error) {
    exitCode = 1;
    logger.error({ err: error }, 'Database shutdown failed');
  }
  logger.info('Shutdown complete');
  logger.flush(() => process.exit(exitCode));
};

process.on('SIGINT', () => { void shutdown('SIGINT', 0); });
process.on('SIGTERM', () => { void shutdown('SIGTERM', 0); });
process.on('unhandledRejection', (error) => {
  logger.fatal({ err: error }, 'Unhandled rejection');
  void shutdown('unhandledRejection', 1);
});
process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught exception');
  void shutdown('uncaughtException', 1);
});

const start = async (): Promise<void> => {
  try {
    await connectDatabase();
    if (shuttingDown) return;
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(env.PORT, () => {
        server.off('error', reject);
        resolve();
      });
    });
    server.on('error', (error) => {
      logger.fatal({ err: error }, 'HTTP server failed');
      void shutdown('serverError', 1);
    });
    logger.info({ port: env.PORT }, 'Server listening');
  } catch (error) {
    logger.fatal({ err: error }, 'Startup failed');
    await shutdown('startupFailure', 1);
  }
};

void start();
