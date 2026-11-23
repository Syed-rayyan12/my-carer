"use client";
import Link from 'next/link';
import type {CareRequirement} from './CareRequirementsContext';
export default function RequirementResponses({requirement,onHide}:{requirement:CareRequirement;onHide:()=>void}){return <section className="mt-3 rounded-2xl border border-[#ececf0] bg-white p-6"><header className="flex justify-between"><h3 className="text-xl font-semibold">Caregiver Responses</h3><button onClick={onHide} className="text-sm text-[#667085]">Hide</button></header><p className="my-4 text-sm">{requirement.responses} caregivers applied for {requirement.title}.</p><Link href={`/care-seeker-dashboard/my-requests/${requirement.id}/responses`} className="text-sm font-semibold text-[#ff2f68]">View applications and respond</Link></section>;}
