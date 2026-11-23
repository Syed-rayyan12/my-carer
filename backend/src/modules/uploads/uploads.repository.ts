import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { env } from '../../config/env.js';

const root = resolve(env.UPLOAD_DIR);
export type UploadMetadata = { id: string; userId: string; name: string;
  type: string; purpose: 'photo' | 'qualification' | 'verification'; createdAt: string };
export async function storeFile(meta: UploadMetadata, bytes: Buffer) {
  await mkdir(root, { recursive: true });
  await writeFile(join(root, `${meta.id}.bin`), bytes, { flag: 'wx', mode: 0o600 });
  await writeFile(join(root, `${meta.id}.json`), JSON.stringify(meta), { flag: 'wx', mode: 0o600 });
}
export async function readUpload(id: string) {
  try {
    const meta = JSON.parse(await readFile(join(root, `${id}.json`), 'utf8')) as UploadMetadata;
    return { meta, bytes: await readFile(join(root, `${id}.bin`)) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}
