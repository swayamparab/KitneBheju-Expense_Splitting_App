import { getUserFromToken } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {

        const userId = await getUserFromToken();

        const { groupId } = await params;

        const group = await prisma.group.findUnique({
            where: {
                id: groupId
            }
        })

        if (!group) {
            return NextResponse.json({
                message: "Group not found"
            }, { status: 404 })
        }

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

        const creditors = result
            .filter((user) => user.balance > 0)
            .map((user) => ({ ...user }));

        const debtors = result
            .filter((user) => user.balance < 0)
            .map((user) => ({ ...user }));

        const settlements: {
            fromUserId: string;
            from: string;
            toUserId: string;
            to: string;
            amount: number;
        }[] = [];

        let i = 0;
        let j = 0;

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];

            const amount = Math.min(
                Math.abs(debtor.balance),
                creditor.balance
            );

            settlements.push({
                fromUserId: debtor.userId,
                from: debtor.username,
                toUserId: creditor.userId,
                to: creditor.username,
                amount: Number(amount.toFixed(2)),
            });

            debtor.balance += amount;
            creditor.balance -= amount;

            if (Math.abs(debtor.balance) < 0.01) {
                i++;
            }

            if (Math.abs(creditor.balance) < 0.01) {
                j++;
            }
        }

        return NextResponse.json(
            {
                message: "Settlements fetched successfully",
                settlements,
            },
            { status: 200 }
        );

    }
    catch (err) {
        return NextResponse.json({
            message: "Error fetching settlements",
            err
        }, { status: 500 })
    }
}