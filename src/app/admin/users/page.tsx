/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import AdminBar from "@/components/admin/AdminBar"
import CsrPagination from "@/components/CsrPagination"

interface DataResponse {
  users: User[];
  pagination: Pagination;
}

interface User {
  id: number
  name: string
  email: string
  role: string
  createSt: string
}

interface Pagination {
  totalPages: number;
}

export default function AdminUsersPage() {
  const [data, setData] = useState<DataResponse>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/api/admin/users?page=${Number(page)}&limit=10`)
      setData(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return

    try {
      await axios.delete(`/api/admin/users/${id}`)
      setData((prev) =>
        prev ? { ...prev, users: prev.users.filter((u) => u.id !== id) } : prev
      )
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6">

      {/* Top Admin Summary */}
      <AdminBar />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-wide">
          Users Management
        </h1>
        <span className="text-sm text-gray-400">
          Total: {data?.users.length}
        </span>
      </div>

      {/* Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-400">Loading users...</div>
        ) : error ? (
          <div className="p-6 text-red-400">{error}</div>
        ) : data?.users.length === 0 ? (
          <div className="p-6 text-gray-500">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Created</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="px-6 py-4 text-gray-400">
                    #{user.id}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createSt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
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
