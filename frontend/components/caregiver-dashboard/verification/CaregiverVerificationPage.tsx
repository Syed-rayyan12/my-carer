"use client";
import { useRef, useState } from 'react';
import { BadgeCheck, Clock3, UploadCloud } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthBoundary';
import { accountApi } from '@/components/auth/auth-client';
import { useCaregiverDashboard } from '../CaregiverDashboardContext';
import { isCaregiverVerified, validateVerificationFile } from './verificationData';
import VerificationDocumentsTable from './VerificationDocumentsTable';
import VerificationItems from './VerificationItems';
import VerificationDocumentModal from './VerificationDocumentModal';
import CaregiverVerificationSkeleton from './CaregiverVerificationSkeleton';

function fileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Unable to read this document. Choose the file again.'));
    reader.onload = () => typeof reader.result === 'string'
      ? resolve(reader.result.split(',')[1]) : reject(new Error('Unable to read document'));
    reader.readAsDataURL(file);
  });
}
export default function CaregiverVerificationPage() {
  const session = useAuth()!;
  const { documents, snapshot, ready, mutate, busy } = useCaregiverDashboard();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [kind, setKind] = useState('DBS');
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const sending = useRef(false);
  if (!ready) return <CaregiverVerificationSkeleton />;
  const selected = documents.find(item => item.id === selectedId);
  const verified = isCaregiverVerified(documents);
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 font-nunito text-[#101828] max-[1250px]:px-6 max-[640px]:px-4">
    <header className="mb-6 rounded-xl border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="font-commissioner text-[42px] font-bold max-[640px]:text-[30px]">Profile Verification</h1><p className="mt-1 text-base text-[#363636]">Upload your documents for an administrator to review.</p></header>
    <section className={`mb-6 flex items-center gap-5 rounded-xl border p-6 ${verified ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
      <span className="rounded-full bg-white p-3 text-[#ff2f68]">{verified ? <BadgeCheck size={28} /> : <Clock3 size={28} />}</span>
      <div><h2 className="text-xl font-bold">{verified ? 'Verified' : 'Verification Pending'}</h2><p className="mt-1 text-sm text-slate-600">{verified ? 'Your required documents have been approved.' : 'Submit your documents below and check their review status here.'}</p></div>
    </section>
    <form className="mb-6 rounded-xl border border-[#d9d9d9] bg-white p-5" onSubmit={async event => {
      event.preventDefault();
      if (sending.current || busy) return;
      if (!file) { setError('Choose a document to upload.'); return; }
      const issue = validateVerificationFile(file);
      if (issue) { setError(issue); return; }
      sending.current = true; setUploading(true); setError('');
      try {
        let savedId = uploadId;
        if (!savedId) {
          const response = await accountApi<{ data: { id: string } }>('platform/uploads', {
            method: 'POST', csrfToken: session.csrfToken,
            body: { name: file.name, type: file.type, purpose: 'verification', content: await fileContent(file) },
          });
          savedId = response.data.id; setUploadId(savedId);
        }
        if (await mutate('platform/verifications', { kind, uploadId: savedId }, 'POST')) {
          setFile(null); setUploadId(''); if (input.current) input.current.value = '';
        }
      } catch (issue) { setError(issue instanceof Error ? issue.message : 'Unable to upload document. Please try again.'); }
      finally { sending.current = false; setUploading(false); }
    }}>
      <fieldset disabled={uploading || busy} className="grid grid-cols-[1fr_2fr_auto] items-end gap-4 disabled:opacity-60 max-[750px]:grid-cols-1">
        <label className="text-sm font-semibold">Document type<select value={kind} onChange={event => setKind(event.target.value)} className="mt-2 h-11 w-full rounded-lg border px-3"><option value="DBS">DBS Certificate</option>{snapshot.access.entitlements.qualifications === true && <option value="QUALIFICATION">Qualification</option>}<option value="IDENTITY">Identity</option><option value="RIGHT_TO_WORK">Right to Work</option></select></label>
        <label className="block rounded-xl border border-dashed border-[#d0d5dd] bg-slate-50 p-4 text-sm"><span className="flex items-center gap-2 font-semibold"><UploadCloud size={20} />Upload document</span><input ref={input} type="file" required accept="application/pdf,image/jpeg,image/png" className="mt-3 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#ffebf1] file:px-3 file:py-2 file:text-[#d92358]" onChange={event => {
          const next = event.target.files?.[0] ?? null;
          const issue = next ? validateVerificationFile(next) : '';
          setError(issue); setFile(issue ? null : next); setUploadId('');
          if (issue) event.target.value = '';
        }} /><span className="mt-2 block text-xs text-slate-500">PDF, JPG or PNG, up to 10 MB.</span></label>
        <button className="h-11 rounded-lg bg-[#ff2f68] px-4 text-sm font-semibold text-white">{uploading ? 'Uploading…' : 'Submit for Review'}</button>
      </fieldset>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </form>
    <div className="grid grid-cols-[minmax(0,2.1fr)_minmax(290px,1fr)] gap-6 max-[1100px]:grid-cols-1"><VerificationDocumentsTable documents={documents} onView={document => setSelectedId(document.id)} /><VerificationItems documents={documents} /></div>
    {selected && <VerificationDocumentModal key={selected.id} document={selected} onClose={() => setSelectedId(null)} />}
  </main>;
}
