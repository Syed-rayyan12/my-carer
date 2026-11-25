"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { accountFile } from '../auth/auth-client';

export default function VerificationFilePreview({ uploadId, name }: { uploadId: string; name: string }) {
  const [preview, setPreview] = useState<{ url: string; type: string } | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    let url = '';
    void accountFile(`platform/uploads/${uploadId}`).then(file => {
      if (!active) return;
      url = URL.createObjectURL(file);
      setPreview({ url, type: file.type });
    }).catch(issue => { if (active) setError(issue instanceof Error ? issue.message : 'Unable to load document'); });
    return () => { active = false; if (url) URL.revokeObjectURL(url); };
  }, [uploadId]);
  if (error) return <p role="alert" className="text-sm text-red-700">{error}</p>;
  if (!preview) return <p role="status" className="text-sm text-slate-500">Loading document…</p>;
  return <div className="w-full space-y-3">
    {preview.type === 'application/pdf'
      ? <iframe src={preview.url} title={name} className="h-[420px] w-full rounded-lg border" />
      : <Image unoptimized width={900} height={900} src={preview.url} alt={name} className="mx-auto max-h-[420px] max-w-full rounded-lg object-contain" />}
    <a href={preview.url} download={name} className="inline-flex rounded-lg border px-3 py-2 text-sm font-semibold text-[#ff2f68]">Download document</a>
  </div>;
}
