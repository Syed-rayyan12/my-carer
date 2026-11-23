import type {ReactNode} from 'react';
import {AuthBoundary} from '@/components/auth/AuthBoundary';
import CareSeekerProfileGate from '@/components/auth/CareSeekerProfileGate';
export default function Layout({children}:{children:ReactNode}){return <AuthBoundary role="CARE_SEEKER"><CareSeekerProfileGate>{children}</CareSeekerProfileGate></AuthBoundary>;}
