import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const authorId = payload.id as number;

  try {
    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    // page 1, limit 10 = 0-9
    // page 2, limit 10 = 10-19
    const skip = (page - 1) * limit;

    const [postsData, total] = await prisma.$transaction([
      prisma.post.findMany({
        where: { authorId: user.id },
        skip,
        take: limit,
        orderBy: { createAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          imageUrl: true,
          createAt: true,
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
          tags: {
            select: {
              tag: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.post.count({
        where: { authorId: user.id },
      }),
    ]);

    return NextResponse.json({
      postsData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
