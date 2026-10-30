import AdminCaregiverDetailPage from "@/components/admin/caregivers/AdminCaregiverDetailPage";

export const metadata = { title: "Caregiver Account | My Carer Admin" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminCaregiverDetailPage key={id} caregiverId={id} />;
}
