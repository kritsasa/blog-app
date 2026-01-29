import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password?.trim()) {
        return NextResponse.json(
            { message: "Invalid input" }, 
            { status: 400 }
        )
    }

     const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail }
    })

    const checkPassword = user && await bcrypt.compare(password,user.password);

    if(!checkPassword) {
        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
        )
    }

    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    )

    const response = NextResponse.json(
        { message: "Login successful!", role: user.role },
        { status: 200 }
    )

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60
    })

    return response

  } catch (e) {
    console.error(e);
    return NextResponse.json(
        { message: "Server error" }, 
        { status: 500 }
    );
  }
}
