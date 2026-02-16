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
                    router.replace('/admin/users');
                } else {
                    router.replace('/')
                }

                router.refresh();
            }
        } catch (error: any) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-full max-w-md rounded-2xl border border-emerald-900/40 bg-black/80 backdrop-blur shadow-xl p-8">
                <h1 className="mb-6 text-center text-2xl font-bold tracking-wide text-emerald-400">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-lg border border-emerald-900/50 bg-black px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-lg border border-emerald-900/50 bg-black px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {message && (
                        <p className="text-sm text-red-400">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg border border-emerald-500 bg-black py-2 font-semibold text-emerald-500 hover:bg-emerald-500 hover:text-black transition duration-500"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    {"Don't already have an account?"}{" "}
                    <a
                        href="/register"
                        className="text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                        Register
                    </a>
                </p>
            </div>
        </div>

    );
}
