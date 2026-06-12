import { getUserFromToken } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

//remove a member from group as owner
export async function DELETE(request: Request,
    { params }: { params: Promise<{ groupId: string; memberId: string; }>; }
) {
    try {
        const currentUserId = await getUserFromToken();

        const { groupId, memberId } = await params;

        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group) {
            return NextResponse.json({
                message: "Group not found",
            }, { status: 404 });
        }

        if (group.ownerId !== currentUserId) {
            return NextResponse.json({
                message: "Insufficient Permissions",
            }, { status: 403 });
        }

        // Owner cannot remove themselves
        if (memberId === group.ownerId) {
            return NextResponse.json({
                message: "Owner cannot be removed themselves",
            }, { status: 404 });
        }

        const membership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: memberId,
                    groupId,
                },
            },
        });

        if (!membership) {
            return NextResponse.json({
                message: "Member not found in group",
            }, { status: 404 });
        }

        await prisma.groupMember.delete({
            where: {
                userId_groupId: {
                    userId: memberId,
                    groupId,
                },
            },
        });

        return NextResponse.json({
            message: "Member removed successfully",
        }, { status: 200 });

    }
    catch (err) {
        return NextResponse.json({
            message: "Failed to remove member",
            err
        }, { status: 400 });
    }
}