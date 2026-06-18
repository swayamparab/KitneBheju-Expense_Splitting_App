import { getCurrentUser, getUserFromToken } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { error } from "node:console";

//get info of a particular group
//not used in frontend since services is created for this GET
export async function GET(request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {

        const userId = await getUserFromToken();

        const { groupId } = await params;

        const membership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId
                }
            }
        })

        if (!membership) {
            return NextResponse.json({
                message: "You do not have access"
            }, { status: 403 })
        }

        const group = await prisma.group.findUnique({
            where: {
                id: groupId
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json({
            message: "Group info fetched successfully",
            group
        }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({
            message: "group info fetch failed",
            err
        })
    }
}

//delete a particular group
export async function DELETE(request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {

    try {

        const userId = await getUserFromToken();

        const { groupId } = await params;

        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group) {
            return NextResponse.json({
                message: "group not found"
            }, { status: 404 })
        }

        if (group.ownerId !== userId) {
            return NextResponse.json({
                message: "Insufficient permissions",
            }, { status: 400 });
        }

        await prisma.$transaction([
            prisma.groupMember.deleteMany({
                where: {
                    groupId,
                },
            }),

            prisma.group.delete({
                where: {
                    id: groupId,
                },
            }),
        ]);

        return NextResponse.json({
            message: "group deleted successfully"
        }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({
            message: "failed to delete group",
            err
        })
    }
}

//edit name of a particular group
export async function PATCH(request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        const userId = await getUserFromToken();

        const { name } = await request.json();

        const { groupId } = await params;

        const group = await prisma.group.findUnique({
            where: {
                id: groupId
            }
        })

        if (!group) {
            return NextResponse.json({
                message: "group not found"
            }, { status: 404 })
        }

        if (group.ownerId !== userId) {
            return NextResponse.json({
                message: "Insufficient permissions"
            }, { status: 403 })
        }

        const updatedGroup = await prisma.group.update({
            where: {
                id: groupId
            },
            data: {
                name
            }
        })

        return NextResponse.json({
            message: "group info edited successfully",
            group: updatedGroup
        }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({
            message: "failed to edit group info",
            err
        })
    }
}