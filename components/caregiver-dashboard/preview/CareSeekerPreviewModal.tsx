import CaregiverModal from "../shared/CaregiverModal";
import CaregiverPublicProfile from "./CaregiverPublicProfile";

export default function CareSeekerPreviewModal({ onClose, onContact }: { onClose: () => void; onContact: () => void }) { return <CaregiverModal title="Profile Preview" subtitle="Viewing as a care seeker" width="preview" onClose={onClose}><div className="max-h-[65dvh] overflow-y-auto rounded-xl bg-[#f8fafc] p-6 max-[600px]:p-3"><CaregiverPublicProfile onContact={onContact} /></div><p className="px-6 py-3 text-[11px] text-[#98a2b3]">Your email, phone, address and reference contact details are private.</p></CaregiverModal>; }
