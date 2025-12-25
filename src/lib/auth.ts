import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret"
);

interface JWTPayload {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
}

export async function verifyToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role !== "ADMIN" && payload.role !== "USER") {
      return null;
    }

    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
