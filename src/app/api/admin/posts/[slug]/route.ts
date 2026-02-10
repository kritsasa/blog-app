import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
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
    const { slug: slugSearch } = await params;
    const {
      title,
      content,
      categoryId,
      tagIds = [],
      imageUrl,
    } = await req.json();

    const post = await prisma.post.findUnique({
      where: { slug: slugSearch },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (!title?.trim() || !content?.trim() || !categoryId) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    function toSlug(title: string) {
      return title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-") // space → -
        .replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, "") // อนุญาต ไทย + อังกฤษ + เลข
        .replace(/-+/g, "-") // กัน -- ซ้อน
        .replace(/^-|-$/g, ""); // ลบ - หน้า/ท้าย
    }

    const slug = toSlug(title);

    await prisma.$transaction(async (tx) => {
      const updatePost = await tx.post.update({
        where: { id: post.id },
        data: {
          title: title.trim(),
          slug,
          content: content.trim(),
          categoryId,
          imageUrl: imageUrl?.trim() || null,
        },
      });

      if (Array.isArray(tagIds) && tagIds.length > 0) {
        await tx.postTag.deleteMany({
          where: { postId: updatePost.id },
        });

        await tx.postTag.createMany({
          data: tagIds.map((tagId: number) => ({
            postId: updatePost.id,
            tagId,
          })),
          skipDuplicates: true,
        });
      }
    });

    return NextResponse.json(
      { message: "Post update successfully" },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
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
    const { slug: slugSearch } = await params;

    const post = await prisma.post.findUnique({
      where: { slug: slugSearch },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.postTag.deleteMany({
        where: { postId: post.id },
      });

      await tx.comment.deleteMany({
        where: { postId: post.id },
      });

      await tx.post.delete({
        where: { id: post.id },
      });
    });

    return NextResponse.json(
      { message: "Post delete successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { messahe: "Internal server error" },
      { status: 500 },
    );
  }
}
