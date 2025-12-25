import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { name } = await req.json();
    const tagName = name?.trim();

    if (!tagName) {
      return NextResponse.json(
        { message: "Tag name is required" },
        { status: 400 }
      );
    }

    const existed = await prisma.tag.findUnique({
      where: { name: tagName },
    });

    if (existed) {
      return NextResponse.json(
        { message: "Tag already exists" },
        { status: 409 }
      );
    }

    await prisma.tag.create({
      data: { name: tagName },
    });

    return NextResponse.json(
      { message: "Tag created successfully" },
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

export async function GET(req: NextRequest) {
  try {
    const result = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error("Fetch error:", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
