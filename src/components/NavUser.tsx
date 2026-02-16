"use client";
import Link from "next/link";
import { logout } from "@/app/actions/logout";
import { useRouter } from "next/navigation";

type Props = {
  payload: {
    id: number;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
  } | null;
};

export default function NavUser({ payload }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/")
    router.refresh();
  }
 
  if (!payload) {
    return (
      <a
        href="/login"
        className="text-xs sm:text-sm rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-emerald-400 hover:bg-emerald-500/20 transition"
      >
        Login
      </a>
    );
  }

  return (
    <div className="flex items-center gap-0.5 sm:gap-3">
      <span className="text-xs sm:text-sm text-gray-200">
        {payload.name}
      </span>

      <button
        className="text-xs sm:text-sm rounded-md border border-red-500/30 px-3 py-1.5 text-red-400 hover:bg-red-500/10 transition"
        onClick={handleLogout}
      >
        Logout
      </button>

      <Link
        href="/dashboard/create"
        className="text-xs sm:text-sm rounded-md bg-emerald-500 px-4 py-1.5 font-medium text-black hover:bg-emerald-400 transition"
      >
        สร้างโพสต์ใหม่
      </Link>

      { payload.role === "ADMIN" && (
        <Link
          href={'/admin/users'}
          className="text-xs sm:text-sm rounded-md bg-emerald-500 px-4 py-1.5 font-medium text-black hover:bg-emerald-400 transition"
        >
          Admin Dashboard
        </Link>
      )}
    </div>
  );
}
