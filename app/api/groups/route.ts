import { getCurrentUser, getUserFromToken } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createGroupSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

//create a new group
export async function POST(request: NextRequest) {
    try {

        const user = await getCurrentUser();

        const body = await request.json();
        const validatedData = createGroupSchema.parse(body);

        const inviteCode = crypto
                            .randomUUID()
                            .replace(/-/g, "")
                            .slice(0, 8)
                            .toUpperCase();

        const group = await prisma.group.create({
            data: {
                name: validatedData.name,
                ownerId: user.id,
                inviteCode,

                members: {
                    create: {
                        userId: user.id
                    }
                }
            }
        })

        return NextResponse.json({
            message: "Group created successfully",
            group
        }, { status: 201 })
    }
    catch (err) {
        return NextResponse.json({
            message: "Failed to create group",
            err
        })
    }
}

//get all groups of logged in user
//not using in frontend since took the approach of service layer + server components
export async function GET() {

    try {

        const userId = await getUserFromToken();

        const groups = await prisma.group.findMany({
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        members: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: "All groups fetched successfully",
            groups
        }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({
            message: "group fetch failed",
            err
        })
    }
}