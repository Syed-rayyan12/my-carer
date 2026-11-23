import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from './env.js';

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: env.DATABASE_URL,
      application_name: 'my-carer-api',
      max: env.DATABASE_POOL_MAX,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 3000,
      query_timeout: 3000,
      statement_timeout: 3000,
    }),
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
  // Driver adapters can establish connections lazily; verify the connection before listening.
  await checkDatabase();
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};

export const checkDatabase = async (): Promise<void> => {
  await prisma.$queryRaw`SELECT 1`;
};
