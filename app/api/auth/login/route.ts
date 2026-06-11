import { generateToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try{
        const body = await request.json();

        const validatedData = loginSchema.parse(body);

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {username: validatedData.identifier},
                    {email: validatedData.identifier}
                ]
            }
        })

        if(!user){
            return NextResponse.json({
                message: "Invalid Credentials"
            }, {status: 400})
        }

        const isPasswordCorrect = await bcrypt.compare(validatedData.password, user.password);

        if(!isPasswordCorrect){
            return NextResponse.json({
                message: "Invalid Credentials"
            }, {status: 401})
        }

        const token = generateToken(user.id);

        const response = NextResponse.json({
            message: "User logged in successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        }, {status: 201})

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        })

        return response;
    }
    catch(err){
        return NextResponse.json({
            message: "Login failed",
            err
        }, {status: 400})
    }
}