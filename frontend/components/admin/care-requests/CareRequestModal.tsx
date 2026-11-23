import AdminModal, { AdminModalFooter } from "../shared/AdminModal";
import EditCareRequestForm from "./EditCareRequestForm";
import type { AdminCareRequest } from "./careRequestsData";

export default function CareRequestModal({ request, action, onClose, onSave }: { request: AdminCareRequest; action: "edit" | "approve" | "remove"; onClose: () => void; onSave: (request: AdminCareRequest) => void }) {
  return <AdminModal title={action === "edit" ? "Edit Care Request" : action === "approve" ? "Approve Care Request" : "Remove Care Request"} wide={action === "edit"} onClose={onClose}>{action === "edit" ? <EditCareRequestForm request={request} onSave={onSave} onClose={onClose} /> : <><p className="px-6 pb-6 text-sm leading-6 text-[#61706c]">{action === "approve" ? `Approve ${request.careType} for ${request.name} in ${request.location}?` : `Remove ${request.careType} for ${request.name}? This request will remain available in the Removed tab.`}</p><AdminModalFooter label={action === "approve" ? "Approve" : "Remove"} danger={action === "remove"} onCancel={onClose} onConfirm={() => onSave({ ...request, status: action === "approve" ? "Active" : "Removed" })} /></>}</AdminModal>;
}
