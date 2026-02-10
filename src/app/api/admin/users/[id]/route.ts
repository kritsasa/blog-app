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

    await prisma.postTag.deleteMany({
      where: {
        post: {
          authorId: Number(id),
        },
      },
    });

    // ลบ Comment ที่อยู่ใน post ของ user
    await prisma.comment.deleteMany({
      where: {
        post: { authorId: Number(id) },
      },
    });

    // ลบ Comment ที่ user ไปคอมเมนต์ไว้ที่อื่น
    await prisma.comment.deleteMany({
      where: {
        userId: Number(id),
      },
    });

    await prisma.post.deleteMany({
      where: { authorId: Number(id) },
    });

    await prisma.user.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { message: "User deleted successfully" },
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
