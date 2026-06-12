import { NextResponse } from "next/server";

export async function POST() {

    try {
        const response = NextResponse.json({
            message: "User logged out successfully"
        }, { status: 200 })

        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 0,
        })

        return response;
    }
    catch (err) {
        return NextResponse.json({
            message: "logout failed",
            err
        })
    }
}