import AdminBlogEditorPage from "@/components/admin/blog/AdminBlogEditorPage";
export const metadata = { title: "Edit Blog Post | My Carer Admin" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <AdminBlogEditorPage key={id} postId={id} />; }
