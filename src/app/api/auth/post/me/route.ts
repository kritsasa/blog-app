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

    const posts = await prisma.post.findMany({
      where: { authorId },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        imageUrl: true,
        createAt: true,
        category: { select: { id: true, name: true } },
        tags: {
          select: {
            tag: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
