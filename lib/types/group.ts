import { Prisma } from "@prisma/client";

export type ExpenseWithRelations = Prisma.ExpenseGetPayload<{
  include: {
    paidBy: {
      select: {
        id: true;
        username: true;
      };
    };
    participants: {
      include: {
        user: {
          select: {
            id: true;
            username: true;
          };
        };
      };
    };
  };
}>;

export type GetGroupExpensesResponse = {
  expenses: ExpenseWithRelations[];
  hasMore: boolean;
  nextCursor: string | null;
};