import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
        return NextResponse.json(
            { message: "Missing required fields: email, username, password" },
            { status: 400 }
        )
    }

    const existedEmail = await prisma.user.findUnique({
        where: { email }
    })

    if (existedEmail) {
        return NextResponse.json(
            { message: "Email already exists." },
            { status: 400 }
        )
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name: username,
            email,
            password: hashedPassword
        }
    })

    return NextResponse.json(
        { message: "Registration successful!" },
        { status: 201 }
    )

  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to register." },
      { status: 500 }
    );
  }
}
