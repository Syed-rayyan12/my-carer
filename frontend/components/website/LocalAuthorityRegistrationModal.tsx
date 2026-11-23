"use client";
import {SignupModal} from "./SignupModal";
export default function LocalAuthorityRegistrationModal({onClose}:{onClose:()=>void}){return <SignupModal onClose={onClose} initialRole="CARE_SEEKER" initialPlanId="FAMILY_FREE"/>;}
