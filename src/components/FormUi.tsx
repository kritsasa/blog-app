"use client";
// import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";

type Props = {
    form: {
        title: string;
        slug: string
        content: string;
        imageUrl?: string;
        categoryId: number;
        tagIds: number[];
    }
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleCategoryChange: (value: number) => void;
    toggleTag: (id: number) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
}


type Category = {
    id: number;
    name: string;
}

type Tag = {
    id: number;
    name: string;
}

export default function FormUi({ form, handleChange, handleCategoryChange, toggleTag, handleSubmit, loading, error }: Props) {
    const { data: categories = [] } = useFetch<Category[]>("/api/auth/category");
    const { data: tags = [] } = useFetch<Tag[]>("/api/auth/tag");

    return (
        <>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* title */}
                <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={100}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                {/* image url */}
                <div>
                    <label className="block font-medium mb-1">Image URL (optional)</label>
                    <input
                        type="text"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* content */}
                <div>
                    <label className="block font-medium mb-1">Content</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        rows={6}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                {/* category */}
                <div>
                    <label className="block font-medium mb-1">Category</label>
                    <select
                        value={form.categoryId}
                        onChange={(e) => handleCategoryChange(Number(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">-- เลือกหมวด --</option>
                        {categories?.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* tags */}
                <div>
                    <label className="block font-medium mb-2">Tags</label>
                    <div className="flex gap-3 flex-wrap">
                        {tags?.map((tag) => (
                            <button
                                type="button"
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                className={`px-3 py-1 rounded border text-sm ${form.tagIds.includes(tag.id)
                                    ? "bg-black text-white"
                                    : "bg-white"
                                    }`}
                            >
                                #{tag.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* error */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? "กำลังสร้าง..." : "ยืนยีน"}
                </button>
            </form>
        </>
    )
}