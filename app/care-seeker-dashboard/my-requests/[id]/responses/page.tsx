import CaregiverResponsesPage from "@/components/dashboard/requests/CaregiverResponsesPage";

export const metadata = { title: "Caregiver Responses | My Carer" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CaregiverResponsesPage key={id} requirementId={id} />;
}
