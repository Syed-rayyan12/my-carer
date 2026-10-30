"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export default function AdminModal({ title, wide = false, onClose, children }: { title: string; wide?: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, []);
  return <dialog ref={ref} aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }} className={`m-auto max-h-[90dvh] w-[calc(100%-32px)] overflow-y-auto rounded-[10px] border-0 bg-white p-0 font-nunito text-[#182522] shadow-2xl backdrop:bg-black/40 ${wide ? "max-w-[672px]" : "max-w-[448px]"}`}><header className="flex items-center justify-between gap-4 px-6 py-5"><h2 className="text-lg font-bold">{title}</h2><button type="button" aria-label="Close dialog" className="rounded p-1 text-[#61706c] hover:bg-gray-100" onClick={onClose}><X size={18} /></button></header>{children}</dialog>;
}
export function AdminModalFooter({ onCancel, label, danger = false, onConfirm, disabled = false }: { onCancel: () => void; label: string; danger?: boolean; onConfirm?: () => void; disabled?: boolean }) {
  return <footer className="flex justify-end gap-2 border-t border-[#dfe4e1] bg-[#f4f6f5] px-6 py-4"><button type="button" className="rounded-lg border border-[#dfe4e1] bg-white px-4 py-2.5 text-sm" onClick={onCancel}>Cancel</button><button type={onConfirm ? "button" : "submit"} disabled={disabled} onClick={onConfirm} className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${danger ? "bg-[#b91e13]" : "bg-[#ff2f68]"}`}>{label}</button></footer>;
}
