import type {ReactNode} from 'react';
import {AuthBoundary} from '@/components/auth/AuthBoundary';
import {LiveWorkspaceProvider} from '@/components/platform/LiveWorkspace';
import CaregiverDashboardLayout from '@/components/caregiver-dashboard/CaregiverDashboardLayout';
export default function Layout({children}:{children:ReactNode}){return <AuthBoundary role="CAREGIVER"><LiveWorkspaceProvider><CaregiverDashboardLayout>{children}</CaregiverDashboardLayout></LiveWorkspaceProvider></AuthBoundary>;}
