import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

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

    const tag = await prisma.tag.findUnique({
      where: { id: Number(id) },
    });

    if (!tag) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    await prisma.postTag.deleteMany({
      where: { tagId: Number(id) },
    });

    await prisma.tag.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Tag deleted successfully" },
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
