import { getUserFromToken } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

//leave a group
export async function DELETE(
    request: Request,
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
                message: "Group not found",
            }, { status: 404 })
        }

        if (group.ownerId === userId) {
            return NextResponse.json({
                message: "Group owner cannot leave",
            }, { status: 400 })
        }

        const membership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId,
                },
            },
        });

        if (!membership) {
            return NextResponse.json({
                    message: "you are not part of this group",
                }, {status: 404})
        }

        await prisma.groupMember.delete({
            where: {
                userId_groupId: {
                    userId,
                    groupId,
                },
            },
        });

        return NextResponse.json({
            message: "group left successfully"
        })
    } catch(err) {
        return NextResponse.json({
            message: "failed to leave group",
            err
        }, {status: 400})
    }
}