import type { ReactNode } from 'react';
import { AuthBoundary } from '@/components/auth/AuthBoundary';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
export default function Layout({ children }: { children: ReactNode }) { return <AuthBoundary role="ADMIN"><AdminDashboardLayout>{children}</AdminDashboardLayout></AuthBoundary>; }
