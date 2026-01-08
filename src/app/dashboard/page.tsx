/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";

interface Post {
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
}

export default function MyPostsPage() {
    const { data, loading, error } = useFetch<Post[]>("/api/auth/post/me");

    if (loading) return <p className="p-6">Loading...</p>;
    if (error) return <p className="p-6 text-red-500">Failed to load posts</p>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">โพสต์ของฉัน</h1>
                <Link
                    href="/posts/create"
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                    สร้างโพสต์ใหม่
                </Link>
            </div>

            {data?.length === 0 && (
                <p className="text-gray-500">คุณยังไม่มีโพสต์</p>
            )}

            <ul className="space-y-5">
                {data?.map((post) => (
                    <li
                        key={post.id}
                        className="border rounded-lg overflow-hidden"
                    >
                        <div className="flex gap-4 p-4">
                            {/* image */}
                            {post.imageUrl ? (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-32 h-24 object-cover rounded"
                                />
                            ) : null}

                            {/* content */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="font-semibold text-lg">{post.title}</h2>
                                        <p className="text-xs text-gray-500">
                                            {new Date(post.createAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex gap-3 shrink-0">
                                        <Link
                                            href={`/posts/${post.slug}`}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            ดู
                                        </Link>
                                        <Link
                                            href={`/dashboard/posts/${post.id}/edit`}
                                            className="text-sm text-gray-600 hover:underline"
                                        >
                                            แก้ไข
                                        </Link>
                                    </div>
                                </div>

                                {/* category + tags */}
                                <div className="flex flex-wrap gap-2">
                                    {post.category && (
                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                            {post.category.name}
                                        </span>
                                    )}
                                    {post.tags.map((t) => (
                                        <span
                                            key={t.tag.id}
                                            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded"
                                        >
                                            #{t.tag.name}
                                        </span>
                                    ))}
                                </div>

                                {/* excerpt */}
                                <p className="text-sm text-gray-700 line-clamp-2">
                                    {post.content}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
