import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { env } from '../../config/env.js';
import { prisma } from '../../config/db.js';

const legacyRoot = resolve(env.UPLOAD_DIR);
export type UploadMetadata = {
  id: string;
  userId: string;
  name: string;
  type: string;
  purpose: 'photo' | 'qualification' | 'verification';
  createdAt: string;
};
export async function storeFile(meta: UploadMetadata, bytes: Buffer) {
  await prisma.uploadedFile.create({
    data: {
      id: meta.id,
      userId: meta.userId,
      name: meta.name,
      type: meta.type,
      purpose: meta.purpose,
      createdAt: new Date(meta.createdAt),
      content: Uint8Array.from(bytes),
    },
  });
}
export async function readUploadMetadata(id: string): Promise<UploadMetadata | null> {
  const file = await prisma.uploadedFile.findUnique({
    where: { id },
    select: { id: true, userId: true, name: true, type: true, purpose: true, createdAt: true },
  });
  return file
    ? {
        ...file,
        purpose: file.purpose as UploadMetadata['purpose'],
        createdAt: file.createdAt.toISOString(),
      }
    : null;
}
export async function readUpload(id: string) {
  const file = await prisma.uploadedFile.findUnique({ where: { id } });
  if (file) {
    const { content, createdAt, purpose, ...details } = file;
    return {
      meta: {
        ...details,
        purpose: purpose as UploadMetadata['purpose'],
        createdAt: createdAt.toISOString(),
      },
      bytes: Buffer.from(content),
    };
  }
  // Keep existing files readable when an older deployment used a mounted volume.
  try {
    const meta = JSON.parse(
      await readFile(join(legacyRoot, `${id}.json`), 'utf8'),
    ) as UploadMetadata;
    return { meta, bytes: await readFile(join(legacyRoot, `${id}.bin`)) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}
