import CreateRequirementPage from "@/components/dashboard/requirements/CreateRequirementPage";

export const metadata = { title: "Edit Requirement | My Carer" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CreateRequirementPage requirementId={id} />;
}
