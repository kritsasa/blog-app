import Link from "next/link";

interface Props {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  createAt: string;
  category: {
    id: number;
    name: string;
  } | null;
  tags: {
    tag: {
      id: number;
      name: string;
    };
  }[];
  comments: {
    id: number;
    content: string;
  }[];
}

export default async function PostList({ posts }: { posts: Props[] }) {
  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="
            rounded-2xl border border-emerald-500/20
            bg-zinc-900
            px-6 py-5
            shadow transition
            hover:border-emerald-500/50
            hover:shadow-emerald-500/10
          "
        >
          {/* title */}
          <h2 className="mb-1 text-2xl font-semibold text-emerald-400">
            <Link
              href={`/posts/${post.slug}`}
              className="hover:text-emerald-300 transition"
            >
              {post.title}
            </Link>
          </h2>

          {/* meta */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            <span>{new Date(post.createAt).toLocaleDateString()}</span>
            {post.category && (
              <>
                <span>•</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-emerald-400 border border-emerald-500/20">
                  {post.category.name}
                </span>
              </>
            )}
          </div>

          {/* content preview */}
          <p className="mb-5 text-zinc-300 leading-relaxed line-clamp-4">
            {post.content}
          </p>

          {/* tags */}
          {post.tags.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t.tag.id}
                  className="
                    rounded-full border border-zinc-700
                    px-3 py-1 text-xs font-medium
                    text-zinc-300
                    hover:bg-emerald-500 hover:text-black hover:border-emerald-500
                    transition
                  "
                >
                  #{t.tag.name}
                </span>
              ))}
            </div>
          )}

          {/* divider */}
          <div className="my-4 h-px bg-zinc-800" />

          {/* actions */}
          <div className="flex items-center justify-between text-sm">
            <Link
              href={`/posts/${post.slug}`}
              className="
                rounded-full px-4 py-2
                font-medium
                text-emerald-400
                hover:bg-emerald-500/10
                transition
              "
            >
              อ่านต่อ
            </Link>

            <Link
              href={`/posts/${post.slug}`}
              className="
                rounded-full px-4 py-2
                text-zinc-400
                hover:bg-zinc-800
                transition
              "
            >
              {post.comments.length} ความคิดเห็น
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
