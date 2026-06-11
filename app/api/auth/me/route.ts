import { getCurrentUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function GET() {
    
    try{
        const user = await getCurrentUser();

        return NextResponse.json({
            message: "Current user fetched successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })
    }
    catch(err){
        return NextResponse.json({
            message: "user cannot be fetched",
            err
        })
    }
}