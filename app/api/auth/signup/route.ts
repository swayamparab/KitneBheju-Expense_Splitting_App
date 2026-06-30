import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { generateToken } from "@/lib/auth";
import { signupRateLimit } from "@/lib/redis";

export async function POST(request: NextRequest) {

    try {

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

        const { success } = await signupRateLimit.limit(`kb:signup:${ip}`)

        if (!success) {
            return NextResponse.json({
                message: "Too many signup attempts"
            }, { status: 429 })
        }
        const body = await request.json();

        const validatedData = signupSchema.parse(body);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: validatedData.username },
                    { email: validatedData.email }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json({
                message: "user already exists"
            }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const user = await prisma.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                password: hashedPassword
            }
        })

        const token = generateToken(user.id);

        const response = NextResponse.json({
            message: "user signed up successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        }, { status: 201 })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        })

        return response;

    }
    catch (err) {
        return NextResponse.json({
            message: "signup failed",
            err
        }, { status: 400 })
    }
}