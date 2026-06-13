import { getUserFromToken } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createExpenseSchema } from "@/lib/validation";
import { stat } from "fs";
import { NextRequest, NextResponse } from "next/server";

//create a new expense in group
export async function POST(request: NextRequest,
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
                message: "You do not have access to this group"
            }, { status: 403 })
        }

        const body = await request.json();

        const validatedData = createExpenseSchema.parse(body);

        let participantIds = [...validatedData.participantIds];

        //ensure the payer is always included
        if (!participantIds.includes(userId)) {
            participantIds.push(userId)
        }

        const groupMembers = await prisma.groupMember.findMany({
            where: {
                groupId,
                userId: {
                    in: participantIds
                }
            }
        })

        if (groupMembers.length !== participantIds.length) {
            return NextResponse.json({
                message: "One or more participants are not member of this group"
            }, { status: 400 })
        }

        const expense = await prisma.expense.create({
            data: {
                title: validatedData.title,
                amount: validatedData.amount,
                groupId,
                paidById: userId,

                participants: {
                    create: participantIds.map(
                        (participantId) => ({
                            userId: participantId
                        })
                    )
                }
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
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            },
        })

        return NextResponse.json({
            message: "Expense created successfully",
            expense
        }, { status: 201 })
    }
    catch (err) {
        return NextResponse.json({
            message: "expense creation failed",
            err
        }, { status: 500 })
    }
}

//get all expenses of a particular group
export async function GET(request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }) {
    try {
        const userId = await getUserFromToken();

        const { groupId } = await params;

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
                message: "you do not have access to this group"
            }, { status: 403 })
        }

        const expenses = await prisma.expense.findMany({
            where: {
                groupId,
            },

            include: {
                paidBy: {
                    select: {
                        id: true,
                        username: true,
                    },
                },

                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            message: "expenses fetched successfully",
            expenses
        }, { status: 200 })
    } catch (err) {
        return NextResponse.json({
            message: "failed to fetch expenses"
        }, { status: 500 })
    }
}