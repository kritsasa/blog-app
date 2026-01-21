/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState<string>("");

    // {
    //   ...form,
    //   email: "abc@gmail.com"
    // }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // <input name="email" value="test@gmail.com" />
        // e.target.name → "email"
        // e.target.value → "test@gmail.com"
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('api/login', form)
            if (response.status === 200) {
                if (response.data.role === 'ADMIN') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard')
                }
            }
        } catch (error: any) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {message && (
                        <p className="text-sm text-red-500">{message}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-purple-600 py-2 text-white font-semibold hover:bg-purple-700 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-6">
                    {"Don't already have an account?"}{" "}
                    <a href="/register" className="text-purple-600 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}
