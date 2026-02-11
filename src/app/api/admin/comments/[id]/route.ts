import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
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
    const { id } = await params;
    const { content } = await req.json();

    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    if (!content?.trim()) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    await prisma.comment.update({
      where: { id: Number(id) },
      data: {
        content: content.trim(),
      },
    });

    return NextResponse.json(
      { message: "Comment updated successfully" },
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
  { params }: { params: { id: string } },
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
    const { id } = await params;

    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    await prisma.comment.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Comment deleted successfully" },
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
