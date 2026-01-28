// components/post/PostDetail.tsx
import Image from "next/image";
import { cookies } from "next/headers"
import { jwtVerify } from "jose";
import DeleteCommentButton from "./DeleteCommentButton";
import CreateComment from "./CreateComment";
import EditCommentButton from "./EditCommentButton";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret"
);


type PostDetailProps = {
  post: {
    id: number;
    title: string;
    slug: string;
    content: string;
    imageUrl: string | null;
    author: { id: number; name: string };
    category: { name: string };
    tags: { tag: { id: number; name: string } }[];
    comments: {
      id: number;
      content: string;
      user: { id: number; name: string };
    }[];
  };
};

type JwtPayload = {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
};

export default async function PostDetail({ post }: PostDetailProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value as string
  let payload = { id: 0, email: "", role: "USER" }
  if (token) {
    const verified = await jwtVerify(token, JWT_SECRET);
    payload = verified.payload as JwtPayload;
  }

  console.log(post.slug)

  const isAdmin = payload.role === "ADMIN";
  const isOwnerPost = payload.id === post.author.id;
  const isOwnerComment = (commentUserId: number) => payload.id === commentUserId;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>

      <div className="text-sm text-gray-500">
        โดย {post.author.name} · หมวดหมู่ {post.category.name}
      </div>

      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={800}
          height={400}
          className="rounded"
        />
      )}

      <article className="prose max-w-none">
        {post.content}
      </article>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {post.tags.map((t) => (
          <span
            key={t.tag.id}
            className="px-2 py-1 text-sm bg-gray-200 rounded"
          >
            #{t.tag.name}
          </span>
        ))}
      </div>

      {/* Comments */}
      <div className="pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">ความคิดเห็น</h2>

        <div>
          <CreateComment postId={post.id} postSlug={post.slug} payloadId={payload.id}/>
        </div>

        {post.comments.length === 0 && (
          <p className="text-gray-500">ยังไม่มีความคิดเห็น</p>
        )}

        <ul className="space-y-4">
          {post.comments.map((c) => (
            <li key={c.id} className="border rounded p-3">
              <div className="text-sm text-gray-600">
                {c.user.name}
              </div>
              <p>{c.content}</p>
              { isAdmin || isOwnerComment(c.user.id) || isOwnerPost ? (
                <EditCommentButton commentId={c.id} postSlug={post.slug} payloadId={payload.id} />
              ) : null}
              {isAdmin || isOwnerComment(c.user.id) || isOwnerPost ? (
                <DeleteCommentButton commentId={c.id} postSlug={post.slug} payloadId={payload.id} postId={post.id} />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
