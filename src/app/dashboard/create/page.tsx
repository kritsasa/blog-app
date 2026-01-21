/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import FormUi from "@/components/FormUi";

type PostForm = {
    title: string;
    slug: string
    content: string;
    imageUrl?: string;
    categoryId: number;
    tagIds: number[];
}

export default function CreatePostPage() {
    const router = useRouter();

    const [form, setForm] = useState<PostForm>({
        title: "",
        slug: "",
        content: "",
        imageUrl: "",
        categoryId: 1,
        tagIds: []
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


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
            await axios.post("/api/auth/post", form);

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Create post failed");
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
