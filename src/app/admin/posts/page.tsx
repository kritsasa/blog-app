/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useFetch } from "@/hooks/useFetch"
import axios from "axios"
import AdminBar from "@/components/admin/AdminBar"
import Link from "next/link"
import CsrPagination from "@/components/CsrPagination"

interface Post {
  id: number
  title: string
  slug: string
  content: string
  imageUrl: string | null
  createAt: string
}

interface ApiResponse {
  posts: Post[]
  pagination: {
    totalPages: number
  }
}

export default function AdminPostsPage() {
  const [page, setPage] = useState(1)
  const { data, loading, error, reFetch } = useFetch<ApiResponse>(`/api/admin/posts?page=${page}&limit=10`)

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this post?")) return

    try {
      await axios.delete(`/api/admin/posts/${slug}`)
      reFetch();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6">

      {/* Top Admin Summary */}
      <AdminBar />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-wide">
          Posts Management
        </h1>

        <span className="text-sm text-gray-400">
          Page {page} / {data?.pagination.totalPages}
        </span>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-6 text-gray-400">Loading posts...</div>
        ) : error ? (
          <div className="p-6 text-red-400">{error}</div>
        ) : data?.posts.length === 0 ? (
          <div className="p-6 text-gray-500">No posts found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Slug</th>
                <th className="px-6 py-4 text-left">Created</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {data?.posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="px-6 py-4 font-medium">
                    {post.title}
                  </td>

                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {post.slug}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(post.createAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right space-x-4">
                    <Link
                      href={`/dashboard/edit/${post.slug}`}
                      className="text-emerald-400 hover:text-emerald-300 text-xs uppercase tracking-wide transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(post.slug)}
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
