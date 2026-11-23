import { PartyPopper } from "lucide-react";
import CaregiverModal from "../shared/CaregiverModal";

export default function ServiceSavedModal({ name, onClose }: { name: string; onClose: () => void }) { return <CaregiverModal width="small" onClose={onClose}><div className="px-6 pb-6 text-center"><span className="mx-auto -mt-2 mb-5 flex size-14 items-center justify-center rounded-full bg-[#fff0f5] text-[#ff2f68]"><PartyPopper size={25} /></span><h2 className="font-jakarta text-lg font-bold">Service Saved</h2><p className="mt-2 mb-6 text-sm leading-6 text-[#667085]">{name} has been updated on your profile.</p><button autoFocus type="button" onClick={onClose} className="w-full rounded-lg bg-[#ff2f68] py-2.5 text-sm font-semibold text-white">Done</button></div></CaregiverModal>; }
