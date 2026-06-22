import { getUserFromToken } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getGroupBalances } from "@/lib/services/groups";
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
            }, { status: 403 })
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
            }, { status: 404 })
        }

        const balances = await getGroupBalances(groupId, userId);

        const currentUserBalance = balances.find(
            (balance) => balance.userId === userId
        );

        if (
            currentUserBalance &&
            Math.abs(currentUserBalance.balance) > 0.01
        ) {
            return NextResponse.json({
                    message:
                        "Settle your balances before leaving the group",
                }, {status: 400});
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
        }, { status: 200 })
    } catch (err) {
        return NextResponse.json({
            message: "failed to leave group"
        }, { status: 500 })
    }
}