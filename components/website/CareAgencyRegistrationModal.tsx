"use client";
import {SignupModal} from "./SignupModal";
export default function CareAgencyRegistrationModal({onClose}:{onClose:()=>void}){return <SignupModal onClose={onClose} initialRole="CARE_SEEKER" initialPlanId="AGENCY_STARTER"/>;}
