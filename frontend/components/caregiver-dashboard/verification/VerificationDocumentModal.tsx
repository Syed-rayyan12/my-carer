"use client";
import CaregiverModal from '../shared/CaregiverModal';
import VerificationFilePreview from '@/components/platform/VerificationFilePreview';
import { documentDate, type CaregiverVerificationDocument } from './verificationData';
import VerificationBadge from './VerificationBadge';

export default function VerificationDocumentModal({ document, onClose }: { document: CaregiverVerificationDocument; onClose: () => void }) {
  return <CaregiverModal title={document.type} width="large" onClose={onClose}>
    <div className="space-y-5 px-6 pb-5"><div className="flex items-center justify-between gap-3"><span className="text-sm text-slate-500">Uploaded {documentDate(document.uploaded)}</span><VerificationBadge status={document.status} pink /></div>
      <p className="break-all text-sm font-semibold">{document.fileName}</p>
      {document.uploadId ? <VerificationFilePreview uploadId={document.uploadId} name={document.fileName} /> : <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">This older submission contains a reference. Upload a document to provide a viewable copy.</p>}
      {document.reason && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700"><strong>Reason for rejection</strong><p className="mt-1">{document.reason}</p></div>}
    </div><footer className="flex justify-end border-t px-6 py-4"><button type="button" onClick={onClose} className="rounded-lg border px-4 py-2.5 text-sm font-semibold">Close</button></footer>
  </CaregiverModal>;
}
