/* eslint-disable @next/next/no-img-element */
"use client";

import React from 'react'
import Link from "next/link";

interface Props {
    data: { postsData: Post[] } | null;
    loading: boolean;
    error: string | null;
    onDelete?: (slug: string) => void;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    imageUrl: string | null;
    createAt: string;
    category: { id: number; name: string } | null;
    tags: { tag: { id: number; name: string; } }[];
}

function Dashboard({ data, loading, error, onDelete }: Props) {
    return (
        <>
            {loading && <p className="p-6">Loading...</p>}
            {error && <p className="p-6 text-red-500">เกิดข้อผิดพลาด: {error}</p>}

            {data?.postsData?.length === 0 && (
                <p className="text-gray-500">ยังไม่มีโพสต์</p>
            )}

            <ul className="space-y-5">
                {data?.postsData?.map((post) => (
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
                                            href={`/dashboard/edit/${post.slug}`}
                                            className="text-sm text-gray-600 hover:underline"
                                        >
                                            แก้ไข
                                        </Link>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onDelete && onDelete(post.slug);
                                            }}
                                            className="text-sm text-red-600 hover:underline"
                                        >
                                            ลบ
                                        </a>
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
        </>
    )
}

export default Dashboard