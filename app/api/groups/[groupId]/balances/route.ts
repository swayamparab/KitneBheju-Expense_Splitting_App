import { getUserFromToken } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

//not used in frontend since a service is created of getGroupBalance
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

        const expenses = await prisma.expense.findMany({
            where: {
                groupId
            },
            include: {
                paidBy: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                }
            }
        })

        const balances: Record<string, {
            userId: string,
            username: string,
            balance: number
        }> = {};

        for (const expense of expenses) {

            if (expense.participants.length === 0) {
                continue;
            }

            const share = expense.amount / expense.participants.length;

            if (!balances[expense.paidBy.id]) {
                balances[expense.paidBy.id] = {
                    userId: expense.paidBy.id,
                    username: expense.paidBy.username,
                    balance: 0
                }
            }

            balances[expense.paidBy.id].balance += expense.amount;

            for (const participant of expense.participants) {
                if (!balances[participant.user.id]) {
                    balances[participant.user.id] = {
                        userId: participant.user.id,
                        username: participant.user.username,
                        balance: 0
                    }
                }

                balances[participant.user.id].balance -= share;
            }

        }

        const result = Object.values(balances).map(
            (user) => ({
                ...user,
                balance: Number(user.balance.toFixed(2)),
            })
        );

        return NextResponse.json({
            message: "Balances fetched successfully",
            balances: result
        }, { status: 200 })

    }
    catch (err) {
        return NextResponse.json({
            message: "Error fetching balance",
            err
        }, { status: 500 })
    }
}