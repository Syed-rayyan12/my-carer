import { accountApi } from '@/components/auth/auth-client';

export async function uploadCaregiverFile(file: File, purpose: 'photo' | 'qualification' | 'verification', csrfToken: string) {
  const content = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Unable to read file. Choose it again.'));
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.readAsDataURL(file);
  });
  const response = await accountApi<{ data: { id: string; url: string; name: string; type: string } }>(
    'platform/uploads', { method: 'POST', body: { name: file.name, type: file.type, purpose, content }, csrfToken });
  return response.data;
}
