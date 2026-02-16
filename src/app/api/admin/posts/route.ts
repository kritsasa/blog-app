import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { role: true },
  });

  if (!user) {
    return NextResponse.json({ message: "User notfound" }, { status: 404 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      skip: skip,
      take: limit,
    });

    const total = await prisma.post.count();

    return NextResponse.json(
      {
        posts,
        pagination: {
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
