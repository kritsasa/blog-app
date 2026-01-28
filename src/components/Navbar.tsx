// components/navbar/Navbar.tsx
import Link from "next/link";
import NavUser from "./NavUser";
import { cookies } from "next/headers"
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret"
);

type JwtPayload = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value as string
  const payload = token ? (await jwtVerify(token, JWT_SECRET)).payload as JwtPayload : null;

  return (
<nav className="w-full border-b border-emerald-900/40 bg-black">
  <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
    {/* Logo */}
    <Link
      href="/"
      className="text-lg font-bold tracking-wide text-emerald-400 hover:text-emerald-300"
    >
      MyApp
    </Link>

    {/* Menu */}
    <div className="hidden gap-6 md:flex">
      {["Home", "Dashboard", "About", "Contact"].map((item) => (
        <Link
          key={item}
          href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
          className="text-sm text-gray-300 hover:text-emerald-400 transition-colors"
        >
          {item}
        </Link>
      ))}
    </div>

    {/* Right side */}
    <NavUser payload={payload} />
  </div>
</nav>

  );
}
