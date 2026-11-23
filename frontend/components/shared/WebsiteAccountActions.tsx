"use client";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LogoutButton } from '@/components/auth/AuthBoundary';
import type { AuthSession } from '@/components/auth/auth-client';
import { accountDestination } from '@/config/auth-routing';

export default function WebsiteAccountActions({ session, ready, error, onNavigate, onRegister, mobile = false }: {
  session: AuthSession | null; ready: boolean; error: string;
  onNavigate: () => void; onRegister: () => void; mobile?: boolean;
}) {
  if (!ready) return <p role="status" className="text-sm text-[#667085]">Checking account…</p>;
  if (error && !session) return <p role="status" className="max-w-56 text-sm text-[#667085]">{error}</p>;
  const button = 'group inline-flex min-h-11 items-center justify-center gap-3 rounded-[7px] px-4 font-nunito text-[14px] font-medium transition-colors';
  if (session) {
    const role = session.user.role === 'ADMIN' ? 'Admin' : session.user.role === 'CAREGIVER' ? 'Caregiver' : 'Care seeker';
    return <div className={mobile ? 'grid gap-3' : 'flex flex-wrap items-center gap-3'}>
      <p className="max-w-40 truncate text-sm text-[#667085]" title={`${session.user.firstName} ${session.user.lastName} · ${role}`}>{session.user.firstName} · {role}</p>
      <Link href={accountDestination(session.user)} onClick={onNavigate} className={`${button} bg-[#ff2f68] text-white hover:bg-[#e92359]`}>{role} dashboard<ArrowRight size={16} aria-hidden="true" /></Link>
      <LogoutButton className="min-h-11 rounded-[7px] border border-[#ff2f68] px-4 text-sm text-[#101929] hover:bg-[#fff1f4]">Sign out</LogoutButton>
    </div>;
  }
  return <div className={mobile ? 'grid grid-cols-1 gap-3' : 'flex flex-wrap items-center gap-3'}>
    <Link href="/signin" onClick={onNavigate} className={`${button} border border-[#ff2f68] text-[#101929] hover:bg-[#fff1f4]`}>Sign In<ArrowRight size={16} aria-hidden="true" /></Link>
    <button type="button" onClick={onRegister} aria-haspopup="dialog" className={`${button} bg-[#ff2f68] text-white hover:bg-[#e92359]`}>Register Today<ArrowRight size={16} aria-hidden="true" /></button>
  </div>;
}
