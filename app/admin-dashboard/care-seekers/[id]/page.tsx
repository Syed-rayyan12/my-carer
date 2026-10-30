import AdminCareSeekerDetailPage from "@/components/admin/care-seekers/AdminCareSeekerDetailPage";

export const metadata = { title: "Care Seeker Account | My Carer Admin" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminCareSeekerDetailPage key={id} seekerId={id} />;
}
