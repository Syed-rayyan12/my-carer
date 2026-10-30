import CareJobDetailPage from "@/components/admin/care-jobs/CareJobDetailPage";

export const metadata = { title: "Care Job Details | My Carer Admin" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <CareJobDetailPage key={id} jobId={id} />; }
