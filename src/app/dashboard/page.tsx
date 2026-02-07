"use client";

import Link from "next/link";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import axios from "axios";
import Dashboard from "@/components/Dashboard";
import CsrPagination from "@/components/CsrPagination";

interface PostResponse {
    postsData: Post[];
    pagination: Pagination;
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

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function MyPostsPage() {
    const [page, setPage] = useState(1);
    const { data, loading, error, reFetch } =
        useFetch<PostResponse>(`/api/auth/post/me?page=${page}&limit=10`);

    const handleDelete = async (slug: string) => {
        if (!confirm("คุณแน่ใจหรือว่าต้องการลบโพสต์นี้?")) return;
        try {
            await axios.delete(`/api/auth/post/${slug}`);
            reFetch();
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-200">
            <div className="mx-auto max-w-5xl px-4 py-8">
                {/* header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">
                        โพสต์ของฉัน
                    </h1>

                    <Link
                        href="/dashboard/create"
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
                    >
                        + สร้างโพสต์ใหม่
                    </Link>
                </div>

                {/* content */}
                <div className="rounded-xl bg-neutral-900 p-4 shadow-lg">
                    <Dashboard
                        data={data}
                        loading={loading}
                        error={error}
                        onDelete={handleDelete}
                    />
                </div>

                {/* pagination */}
                <div className="mt-6 flex justify-center">
                    <CsrPagination
                        page={page}
                        totalPages={data?.pagination.totalPages || 1}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>
            </div>
        </div>
    );
}
