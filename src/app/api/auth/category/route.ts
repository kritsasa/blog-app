import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (e) {
    console.error("Fetch error:", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
    const categoryName = name?.trim();
    if (!categoryName) {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    const existed = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (existed) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 409 }
      );
    }

    await prisma.category.create({
      data: { name: categoryName },
    });

    return NextResponse.json(
      { message: "Category created successfully" },
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
