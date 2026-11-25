import type { VerificationRecord } from './verificationData';
import VerificationStatusBadge from './VerificationStatusBadge';
import VerificationFilePreview from '@/components/platform/VerificationFilePreview';

export default function VerificationDetails({ record, onReject, onApprove, onClose }: { record: VerificationRecord; onReject: () => void; onApprove: () => void; onClose: () => void }) {
  return <><div className="space-y-4 px-6 pb-6"><dl className="grid grid-cols-2 gap-4 text-sm"><div><dt className="text-xs text-slate-500">Name</dt><dd>{record.name}</dd></div><div><dt className="text-xs text-slate-500">Location</dt><dd>{record.location || 'Not provided'}</dd></div><div><dt className="mb-1 text-xs text-slate-500">Status</dt><dd><VerificationStatusBadge status={record.status} /></dd></div></dl>
      <h3 className="text-sm font-semibold">{record.document}</h3>
      {record.uploadId ? <VerificationFilePreview uploadId={record.uploadId} name={record.reference || record.document} /> : <p className="break-all rounded-lg border p-3 text-sm">{record.reference || 'No document attached to this older submission.'}</p>}
      {record.reason && <p className="text-sm text-red-700">Decision reason: {record.reason}</p>}
    </div><footer className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4">{record.status === 'Pending' ? <><button type="button" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-red-700" onClick={onReject}>Reject</button><button type="button" className="rounded-lg bg-[#ff2f68] px-4 py-2.5 text-sm font-semibold text-white" onClick={onApprove}>Approve</button></> : <button type="button" className="rounded-lg border px-4 py-2.5 text-sm" onClick={onClose}>Close</button>}</footer></>;
}
