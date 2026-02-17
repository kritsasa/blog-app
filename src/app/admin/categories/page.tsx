/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useFetch } from "@/hooks/useFetch"
import axios from "axios"
import AdminBar from "@/components/admin/AdminBar"
import CsrPagination from "@/components/CsrPagination"

interface Category {
    id: number
    name: string
}

interface ApiResponse {
    categories: Category[]
    pagination: {
        totalPages: number
    }
}

export default function AdminCategoryPage() {
    const [name, setName] = useState("")
    const [page, setPage] = useState(1)
    const { data, loading, error, reFetch } = useFetch<ApiResponse>(`/api/admin/category?page=${page}&limit=10`);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        try {
            await axios.post("/api/admin/category", { name })
            setName("")
            reFetch()
        } catch (err: any) {
            alert(err.response?.data?.message || "Create failed")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this category?")) return

        try {
            await axios.delete(`/api/admin/category/${id}`)
            reFetch()
        } catch (err: any) {
            alert(err.response?.data?.message || "Delete failed")
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-200 p-6">

            {/* Admin Summary */}
            <AdminBar />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold tracking-wide">
                    Category Management
                </h1>
                <span className="text-sm text-gray-400">
                    Page {page} / {data?.pagination.totalPages}
                </span>
            </div>

            {/* Create Form */}
            <form
                onSubmit={handleCreate}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 flex gap-4"
            >
                <input
                    type="text"
                    placeholder="New category name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />

                <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    Add
                </button>
            </form>

            {/* Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

                {loading ? (
                    <div className="p-6 text-gray-400">Loading categories...</div>
                ) : error ? (
                    <div className="p-6 text-red-400">{error}</div>
                ) : data?.categories.length === 0 ? (
                    <div className="p-6 text-gray-500">No categories found.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">ID</th>
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.categories.map((cat) => (
                                <tr
                                    key={cat.id}
                                    className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                                >
                                    <td className="px-6 py-4 text-gray-400">
                                        #{cat.id}
                                    </td>

                                    <td className="px-6 py-4 font-medium">
                                        {cat.name}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wide transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mt-6 flex justify-center">
                <CsrPagination
                    page={page}
                    totalPages={data?.pagination.totalPages || 1}
                    onPageChange={(page) => setPage(page)}
                />
            </div>

        </div>
    )
}
