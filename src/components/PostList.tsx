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

  console.log(posts)

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="border rounded-xl p-5 hover:shadow-md transition"
        >
          {/* title */}
          <h2 className="text-xl font-semibold mb-1">
            <Link href={`/posts/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>

          {/* meta */}
          <div className="text-sm text-gray-500 mb-3 flex gap-2">
            <span>
              {new Date(post.createAt).toLocaleDateString()}
            </span>
            {post.category && (
              <span>• {post.category.name}</span>
            )}
          </div>

          {/* content preview */}
          <p className="text-gray-700 line-clamp-3 mb-4">
            {post.content}
          </p>

          {/* tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((t) => (
                <span
                  key={t.tag.id}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  #{t.tag.name}
                </span>
              ))}
            </div>
          )}

          {/* actions */}
          <div className="flex justify-end gap-4 text-sm">
            <Link
              href={`/posts/${post.slug}`}
              className="text-blue-600 hover:underline"
            >
              อ่านต่อ
            </Link>

            <Link
              href={`/posts/${post.slug}`}
              className="text-gray-600 hover:underline"
            >
              { post.comments.length } ความคิดเห็น
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
