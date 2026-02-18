/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";

interface Props {
    data: { postsData: Post[] } | null;
    loading: boolean;
    error: string | null;
    onDelete: (slug: string) => void;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    imageUrl: string | null;
    createAt: string;
    category: { id: number; name: string } | null;
    tags: { tag: { id: number; name: string } }[];
}

function Dashboard({ data, loading, error, onDelete }: Props) {
    return (
        <>
            {loading && (
                <p className="p-6 text-gray-400">Loading...</p>
            )}

            {error && (
                <p className="p-6 text-red-500">
                    เกิดข้อผิดพลาด: {error}
                </p>
            )}

            {data?.postsData?.length === 0 && (
                <p className="text-gray-500">ยังไม่มีโพสต์</p>
            )}

            <ul className="space-y-6">
                {data?.postsData?.map((post) => (
                    <li
                        key={post.id}
                        className="
                            overflow-hidden rounded-xl
                            border border-neutral-800
                            bg-neutral-900
                            transition hover:border-emerald-500/50
                        "
                    >
                        <div className="flex gap-4 p-4">
                            {/* image */}
                            {post.imageUrl && (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="
                                        h-24 w-32 shrink-0
                                        rounded-lg object-cover
                                        border border-neutral-800
                                    "
                                />
                            )}

                            {/* content */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">
                                            {post.title}
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            {new Date(post.createAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* actions */}
                                    <div className="flex gap-3 shrink-0 text-sm">
                                        <Link
                                            href={`/posts/${post.slug}`}
                                            className="
                                                text-emerald-400
                                                hover:text-emerald-300
                                                transition
                                            "
                                        >
                                            ดู
                                        </Link>

                                        <Link
                                            href={`/dashboard/edit/${post.slug}`}
                                            className="
                                                text-gray-400
                                                hover:text-white
                                                transition
                                            "
                                        >
                                            แก้ไข
                                        </Link>

                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onDelete(post.slug);
                                            }}
                                            className="
                                                text-red-500
                                                hover:text-red-400
                                                transition
                                            "
                                        >
                                            ลบ
                                        </a>
                                    </div>
                                </div>

                                {/* category + tags */}
                                <div className="flex flex-wrap gap-2">
                                    {post.category && (
                                        <span
                                            className="
                                                rounded-full
                                                bg-emerald-500/15
                                                px-3 py-1
                                                text-xs font-medium
                                                text-emerald-400
                                            "
                                        >
                                            {post.category.name}
                                        </span>
                                    )}

                                    {post.tags.map((t) => (
                                        <span
                                            key={t.tag.id}
                                            className="
                                                rounded-full
                                                bg-neutral-800
                                                px-3 py-1
                                                text-xs
                                                text-gray-300
                                                hover:bg-emerald-500/20
                                                hover:text-emerald-300
                                                transition
                                            "
                                        >
                                            #{t.tag.name}
                                        </span>
                                    ))}
                                </div>

                                {/* excerpt */}
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    {post.content}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Dashboard;
