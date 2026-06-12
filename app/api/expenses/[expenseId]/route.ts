import { getUserFromToken } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { updateExpenseSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

//info about one particular expense
export async function GET(request: NextRequest,
    { params }: { params: Promise<{ expenseId: string }> }
) {

    try {

        const userId = await getUserFromToken();

        const { expenseId } = await params;

        const expense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            },
            include: {
                paidBy: {
                    select: {
                        id: true,
                        username: true,
                        email: true
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
            }
        })

        if (!expense) {
            return NextResponse.json({
                message: "Expense not found"
            }, { status: 404 })
        }

        const membership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId: expense.groupId
                }
            }
        })

        if (!membership) {
            return NextResponse.json({
                message: "You do not have access"
            }, { status: 403 })
        }

        return NextResponse.json({
            message: "Expense info fetched successfully",
            expense
        }, { status: 200 })

    }
    catch (err) {
        return NextResponse.json({
            message: "error fetching expense info"
        }, { status: 500 })
    }
}

//update a particular expense
export async function PATCH(request: NextRequest,
    { params }: { params: Promise<{ expenseId: string }> }
) {
    try {

        const userId = await getUserFromToken();

        const { expenseId } = await params;

        const expense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            }
        })

        if (!expense) {
            return NextResponse.json({
                message: "Expense not found"
            }, { status: 404 })
        }

        if (expense.paidById !== userId) {
            return NextResponse.json({
                message: "Only the payer can edit this expense"
            }, { status: 403 })
        }

        const body = await request.json();

        const validatedData = updateExpenseSchema.parse(body);

        const updatedExpense = await prisma.expense.update({
            where: {
                id: expenseId
            },
            data: {
                title: validatedData.title,
                amount: validatedData.amount
            }
        })

        return NextResponse.json({
            message: "Expense updated successfully",
            expense: updatedExpense
        })
    }
    catch (err) {
        return NextResponse.json({
            message: "Error editing expense"
        }, { status: 500 })
    }
}

//delete a particular expense
export async function DELETE(request: NextRequest,
    { params }: { params: Promise<{ expenseId: string }> }
) {
    try {

        const userId = await getUserFromToken();

        const { expenseId } = await params;

        const expense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            }
        })

        if (!expense) {
            return NextResponse.json({
                message: "Expense not found"
            }, { status: 404 })
        }

        if (expense.paidById !== userId) {
            return NextResponse.json({
                message: "Only payer can delete this expense"
            }, { status: 403 })
        }

        await prisma.$transaction([
            prisma.expenseParticipant.deleteMany({
                where: {
                    expenseId,
                },
            }),

            prisma.expense.delete({
                where: {
                    id: expenseId,
                },
            }),
        ]);

        return NextResponse.json({
            message: "Expense deleted successfully"
        }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({
            message: "Error deleting expense"
        }, { status: 500 })
    }
}