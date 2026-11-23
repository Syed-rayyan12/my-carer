"use client";
import { useAuth } from '@/components/auth/AuthBoundary';
import AdminPage from '../shared/AdminPage';
import ChangePasswordForm from '@/components/dashboard/settings/ChangePasswordForm';
export default function AdminSettingsPage() {
 const auth=useAuth()!;
 return <AdminPage title="Settings" description="Manage your administrator account and password."><div className="mb-6 grid grid-cols-2 items-start gap-6 max-[1000px]:grid-cols-1"><section className="overflow-hidden rounded-[18px] border border-[#e5e2dc] bg-white shadow-[0_8px_18px_#10192915]"><h2 className="border-b border-[#e5e2dc] px-5 py-4 text-base font-bold">Account details</h2><dl className="space-y-5 p-5">{[{label:'Name',value:`${auth.user.firstName} ${auth.user.lastName}`},{label:'Email',value:auth.user.email},{label:'Role',value:'Administrator'},{label:'Account status',value:auth.user.status}].map(field=><div key={field.label}><dt className="mb-1 text-sm text-[#61706c]">{field.label}</dt><dd className="rounded-lg border border-[#e5e2dc] px-3 py-2.5 text-sm">{field.value}</dd></div>)}</dl></section><ChangePasswordForm/></div></AdminPage>;
}
