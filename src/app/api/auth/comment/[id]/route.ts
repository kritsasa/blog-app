import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await verifyToken(req);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = payload.id;

  try {
    const { id } = await params;
    const postId = Number(id);
    const { content } = await req.json();

    if (Number.isNaN(postId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { message: "Comment too long" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: post.id,
        userId,
      },
    });

    return NextResponse.json(
      { message: "Create comment successful" },
      { status: 201 }
    );
  } catch (e) {
    console.error("Creation error:", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params;
    const commentId = Number(id);
    const { content } = await req.json();

    if (Number.isNaN(commentId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { message: "Comment too long" },
        { status: 400 }
      );
    }

    const isAdmin = user.role === "ADMIN";
    const isOwner = comment.userId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
      },
    });

    return NextResponse.json(
      { message: "Update comment successful" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params;
    const commentId = Number(id);

    if (Number.isNaN(commentId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    const isAdmin = user.role === "ADMIN";
    const isOwner = comment.userId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json(
      { message: "Delete comment successful" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
