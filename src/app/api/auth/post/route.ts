import { NextResponse, NextRequest } from "next/server";
import slugify from "slugify";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    // page 1, limit 10 = 0-9
    // page 2, limit 10 = 10-19
    const skip = (page - 1) * limit;

    const [postsData, total] = await prisma.$transaction([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          createAt: true,
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
          tags: {
            select: {
              tag: { select: { id: true, name: true } },
            },
          },
          comments: {
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              content: true,
              createdAt: true,
              user: {
                select: { id: true, name: true },
              },
            },
          },
        },
      }),
      prisma.post.count(),
    ]);

    return NextResponse.json({
      data: postsData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const authorId = payload.id as number;

  try {
    const { title, content, categoryId, tagIds } = await req.json();
    if (!title?.trim() || !content?.trim() || !categoryId) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const slug = slugify(title.trim(), {
      lower: true,
      strict: true,
    });

    await prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          title: title.trim(),
          slug,
          content: content.trim(),
          authorId,
          categoryId,
        },
      });

      if (Array.isArray(tagIds) && tagIds.length > 0) {
        await tx.postTag.createMany({
          data: tagIds.map((tagId: number) => ({
            postId: newPost.id,
            tagId,
          })),
          skipDuplicates: true,
        });
      }
    });

    return NextResponse.json(
      { message: "Post created successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to create post" },
      { status: 500 }
    );
  }
}
