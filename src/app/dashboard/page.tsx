
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
    tags: { tag: { id: number; name: string; } }[];
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function MyPostsPage() {
    const [page, setPage] = useState(1);
    const { data, loading, error, reFetch } = useFetch<PostResponse>(`/api/auth/post/me?page=${page}&limit=10`);

    const handleDelete = async (slug: string) => {
        if (!confirm("คุณแน่ใจหรือว่าต้องการลบโพสต์นี้?")) {
            return;
        }
        try {
            await axios.delete(`/api/auth/post/${slug}`);
            reFetch();
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">โพสต์ของฉัน</h1>
                <Link
                    href="/dashboard/create"
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                    สร้างโพสต์ใหม่
                </Link>
            </div>

            <Dashboard data={data} loading={loading} error={error} onDelete={handleDelete} />

            <CsrPagination
                page={page}
                totalPages={data?.pagination.totalPages || 1}
                onPageChange={(page) => setPage(page)}
            />
        </div>
    );
}
