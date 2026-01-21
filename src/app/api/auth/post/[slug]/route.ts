import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import slugify from "slugify";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    const postsData = await prisma.post.findUnique({
      where: { slug },
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
    });

    if (!postsData) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(postsData, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Failed to post." }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const payload = await verifyToken(req);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug: slugSearch } = await params;
    const { title, content, categoryId, tagIds = [] } = await req.json();

    const post = await prisma.post.findUnique({
      where: { slug: slugSearch },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (!title?.trim() || !content?.trim() || !categoryId) {
      return NextResponse.json(
        { message: "Invalid input" },
        { status: 400 }
      );
    }

    
    const isAdmin = user.role === "ADMIN";
    const isOwner = post.authorId === user.id;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const slug = slugify(title.trim(), {
      lower: true,
      strict: true,
    });

    await prisma.$transaction(async (tx) => {
      const updatePost = await tx.post.update({
        where: { id: post.id },
        data: {
          title: title.trim(),
          slug,
          content: content.trim(),
          categoryId,
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
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const payload = await verifyToken(req);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug: slugSearch } = await params;

    const post = await prisma.post.findUnique({
      where: { slug: slugSearch },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const isAdmin = user.role === "ADMIN";
    const isOwner = post.authorId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
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
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
