// components/post/PostDetail.tsx
import Image from "next/image";
import { cookies } from "next/headers"
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret"
);


type PostDetailProps = {
  post: {
    id: number;
    title: string;
    content: string;
    imageUrl: string | null;
    author: { id:number; name: string };
    category: { name: string };
    tags: { tag: { id: number; name: string } }[];
    comments: {
      id: number;
      content: string;
      user: { id: number; name: string };
    }[];
  };
};

export default async function PostDetail({ post }: PostDetailProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value as string
  const { payload } = await jwtVerify(token, JWT_SECRET);

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
          <textarea
            placeholder="เขียนความคิดเห็น..."
            className="w-full border rounded px-3 py-2 mb-2"
            rows={4}
          ></textarea>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            ส่งความคิดเห็น
          </button>
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
                <button className="text-red-500 text-sm mt-2">
                  ลบความคิดเห็น
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
