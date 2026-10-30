import CareRequestDetailPage from "@/components/admin/care-requests/CareRequestDetailPage";
export const metadata = { title: "Care Request Details | My Carer Admin" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <CareRequestDetailPage key={id} requestId={id} />; }
