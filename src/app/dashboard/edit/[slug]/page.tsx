/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import axios from "axios";
import FormUi from "@/components/FormUi";

type PostForm = {
    title: string;
    slug: string;
    content: string;
    imageUrl?: string;
    categoryId: number;
    tagIds: number[];
}

interface Post {
    title: string;
    slug: string;
    content: string;
    imageUrl: string | null;
    createAt: string;
    category: { id: number; name: string } | null;
    tags: { tag: { id: number; name: string; } }[];
}

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const { slug } = use(params) as { slug: string };
    const { data: post } = useFetch<Post>(`/api/auth/post/${slug}`);

    const [form, setForm] = useState<PostForm>({
        title: "",
        slug: "",
        content: "",
        imageUrl: "",
        categoryId: 0,
        tagIds: [],
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!post) return;

        setForm({
            title: post.title,
            slug: post.slug,
            content: post.content,
            imageUrl: post.imageUrl || "",
            categoryId: post.category?.id ?? 0,
            tagIds: post.tags.map(t => t.tag.id),
        });
    }, [post]);


    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleCategoryChange = (value: number) => {
        setForm((prev) => ({
            ...prev,
            categoryId: value,
        }))
    }

    const toggleTag = (id: number) => {
        setForm((prev) => ({
            ...prev,
            tagIds: prev.tagIds.includes(id)
                ? prev.tagIds.filter((t) => t !== id)
                : [...prev.tagIds, id],
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.put(`/api/auth/post/${post?.slug}`, form);

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Edit post failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">สร้างโพสต์ใหม่</h1>
                <FormUi
                    form={form}
                    handleChange={handleChange}
                    handleCategoryChange={handleCategoryChange}
                    toggleTag={toggleTag}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                />
            </div>
        </>
    );
}
