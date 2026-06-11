import { verify } from "crypto";
import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { prisma } from "./prisma";
import { NextResponse } from "next/server";

export async function getUserFromToken() {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if(!token){
        throw new Error("Unauthorized");
    }

    const decoded = verifyToken(token);

    return decoded.userId;
}

export async function getCurrentUser(){
    const userId = await getUserFromToken();

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if(!user){
        throw new Error("user not found")
    }

    return user;
}