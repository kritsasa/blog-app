// components/post/PostDetail.tsx
import Image from "next/image";
import { cookies } from "next/headers";
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
    category: { id: number; name: string };
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
  const token = cookieStore.get("token")?.value as string;
  let payload = { id: 0, email: "", role: "USER" };

  if (token) {
    const verified = await jwtVerify(token, JWT_SECRET);
    payload = verified.payload as JwtPayload;
  }

  const isAdmin = payload.role === "ADMIN";
  const isOwnerPost = payload.id === post.author.id;
  const isOwnerComment = (commentUserId: number) =>
    payload.id === commentUserId;

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
        
        {/* Post Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg space-y-6">

          <h1 className="text-3xl font-bold text-white">
            {post.title}
          </h1>

          <div className="text-sm text-gray-400">
            โดย <span className="text-emerald-400">{post.author.name}</span> · 
            หมวดหมู่{" "}
            <span className="text-emerald-400">
              {post.category?.name ?? "ไม่มีหมวดหมู่"}
            </span>
          </div>

          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={800}
              height={400}
              className="rounded-xl border border-neutral-800"
            />
          )}

          <article className="prose prose-invert max-w-none text-gray-300">
            {post.content}
          </article>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((t) => (
              <span
                key={t.tag.id}
                className="
                  rounded-full
                  bg-emerald-500/15
                  px-3 py-1
                  text-xs font-medium
                  text-emerald-400
                "
              >
                #{t.tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-white">
            ความคิดเห็น
          </h2>

          <CreateComment
            postId={post.id}
            postSlug={post.slug}
            payloadId={payload.id}
          />

          {post.comments.length === 0 && (
            <p className="text-gray-500">
              ยังไม่มีความคิดเห็น
            </p>
          )}

          <ul className="space-y-4">
            {post.comments.map((c) => (
              <li
                key={c.id}
                className="
                  bg-black
                  border border-neutral-800
                  rounded-xl
                  p-4
                  space-y-2
                  hover:border-emerald-500/40
                  transition
                "
              >
                <div className="text-sm font-medium text-emerald-400">
                  {c.user.name}
                </div>

                <p className="text-gray-300">
                  {c.content}
                </p>

                {(isAdmin ||
                  isOwnerComment(c.user.id) ||
                  isOwnerPost) && (
                  <div className="flex gap-4 text-sm">
                    <EditCommentButton
                      commentId={c.id}
                      postSlug={post.slug}
                      payloadId={payload.id}
                    />
                    <DeleteCommentButton
                      commentId={c.id}
                      postSlug={post.slug}
                      payloadId={payload.id}
                      postId={post.id}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
