import type { AdminBlogPost } from "./adminBlogData";
import AdminModal, { AdminModalFooter } from "../shared/AdminModal";
import BlogArticleBody from "./BlogArticleBody";

export default function BlogPostModal({ post, action, onClose, onDelete }: { post: AdminBlogPost; action: "preview" | "delete"; onClose: () => void; onDelete: () => void }) {
  return <AdminModal title={action === "preview" ? "Post Preview" : "Delete Post"} wide={action === "preview"} onClose={onClose}>{action === "preview" ? <article className="px-6 pb-6">{post.image && <img src={post.image} alt={post.title} className="mb-4 aspect-[2/1] w-full rounded-lg object-cover" />}<p className="mb-1 text-xs text-[#ff2f68]">{post.category}</p><h3 className="text-xl font-bold capitalize">{post.title || "Untitled post"}</h3><p className="mt-1 mb-4 text-xs text-[#61706c]">By {post.author} · {post.date}</p><p className="mb-4 text-sm leading-6 text-[#61706c]">{post.description}</p><BlogArticleBody content={post.content} /></article> : <><p className="px-6 pb-6 text-sm leading-6 text-[#61706c]">Delete {post.title}? It will be removed from this local preview immediately.</p><AdminModalFooter label="Delete" danger onCancel={onClose} onConfirm={onDelete} /></>}</AdminModal>;
}
