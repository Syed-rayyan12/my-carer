"use client";

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

export default function SaveToast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const toast = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    // Keep feedback visible above native chat dialogs as well as dashboard UI.
    toast.current?.showPopover?.();
    timer.current = setTimeout(() => setVisible(false), 4500);
    return () => clearTimeout(timer.current);
  }, []);
  return <AnimatePresence>{visible && (
    <motion.div
      ref={toast} popover="manual"
      role="status" aria-live="polite" aria-atomic="true"
      initial={{ opacity: 0, x: reducedMotion ? 0 : '110%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reducedMotion ? 0 : '110%' }}
      transition={{ duration: reducedMotion ? 0 : 0.28, ease: 'easeOut' }}
      onMouseEnter={() => clearTimeout(timer.current)}
      onMouseLeave={() => { timer.current = setTimeout(() => setVisible(false), 2000); }}
      className="fixed top-6 right-6 bottom-auto left-auto z-[1000] m-0 flex w-[360px] max-w-[calc(100vw-32px)] items-start gap-3 overflow-hidden rounded-2xl border border-emerald-200 bg-white p-4 text-emerald-950 shadow-[0_12px_40px_#10182826] max-[640px]:top-4 max-[640px]:right-4"
    >
      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={22} aria-hidden="true" />
      <div className="min-w-0 flex-1"><p className="text-sm font-bold">Success</p><p className="mt-1 text-sm leading-5 text-slate-600">{message}</p></div>
      <button type="button" aria-label="Dismiss notification" onClick={() => setVisible(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
    </motion.div>
  )}</AnimatePresence>;
}
