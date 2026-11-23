"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { PlanId, BillingInterval } from "@/config/pricing";
import { SignupForm } from "@/components/auth/AuthForms";
export function SignupModal({
  onClose,
  initialRole,
  initialPlanId,
  dedicatedPlan = Boolean(initialPlanId),
  initialBillingInterval,
  title = "Register",
}: {
  onClose: () => void;
  initialRole?: "CARE_SEEKER" | "CAREGIVER";
  initialPlanId?: PlanId;
  dedicatedPlan?: boolean;
  initialBillingInterval?: BillingInterval;
  title?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="signup-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const b = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < b.left ||
          event.clientX > b.right ||
          event.clientY < b.top ||
          event.clientY > b.bottom
        )
          event.currentTarget.close();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh_-_32px)] w-[calc(100%_-_32px)] max-w-[467px] overflow-y-auto rounded-xl border-0 bg-white p-0 text-[#101929] shadow-2xl backdrop:bg-[#101929]/60"
    >
      <header className="flex h-[62px] items-center justify-between border-b border-[#ece8e5] px-5">
        <h2 id="signup-title" className="font-commissioner text-2xl font-bold">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close registration"
          onClick={() => ref.current?.close()}
          className="grid size-9 place-items-center rounded-full hover:bg-pink-50"
        >
          <X size={18} />
        </button>
      </header>
      <div className="p-5">
        <SignupForm
          initialRole={initialRole}
          initialPlanId={initialPlanId}
          dedicatedPlan={dedicatedPlan}
          initialBillingInterval={initialBillingInterval}
        />
      </div>
    </dialog>
  );
}
