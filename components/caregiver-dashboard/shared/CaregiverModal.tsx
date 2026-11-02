"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export default function CaregiverModal({ title, subtitle, width = "medium", onClose, children }: { title?: string; subtitle?: string; width?: "small" | "medium" | "large" | "preview"; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, []);
  return <dialog ref={ref} aria-label={title ?? "Caregiver confirmation"} onCancel={event => { event.preventDefault(); onClose(); }} className={`m-auto max-h-[90dvh] w-[calc(100%-32px)] overflow-y-auto rounded-[16px] border-0 bg-white p-0 font-nunito text-[#101828] shadow-[0_18px_65px_#10192955] backdrop:bg-[#101828]/45 ${width === "small" ? "max-w-[384px]" : width === "large" ? "max-w-[576px]" : width === "preview" ? "max-w-[1024px]" : "max-w-[512px]"}`}><header className={`flex items-start justify-between gap-3 px-6 pt-6 ${title ? "pb-5" : "pb-0"}`}><div>{title && <h2 className="font-jakarta text-[19px] font-bold">{title}</h2>}{subtitle && <p className="mt-2 text-sm leading-6 text-[#667085]">{subtitle}</p>}</div><button type="button" aria-label="Close dialog" onClick={onClose} className="ml-auto rounded p-1 text-[#98a2b3] hover:bg-gray-50"><X size={18} /></button></header>{children}</dialog>;
}
export function CaregiverModalFooter({ onClose, label, onConfirm, disabled = false, danger = false }: { onClose: () => void; label: string; onConfirm?: () => void; disabled?: boolean; danger?: boolean }) { return <footer className="flex justify-end gap-2 border-t border-[#eaecf0] px-6 py-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm font-semibold">Cancel</button><button type={onConfirm ? "button" : "submit"} disabled={disabled} onClick={onConfirm} className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${danger ? "bg-[#df241c]" : "bg-[#ff2f68]"}`}>{label}</button></footer>; }
