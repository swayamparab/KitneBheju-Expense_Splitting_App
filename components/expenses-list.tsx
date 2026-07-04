"use client";

import type { GetGroupExpensesResponse } from "@/lib/types/group";
import { useState } from "react"
import DeleteExpenseButton from "./delete-expense-button";

type ExpensesListProps = {
    groupId: string,
    userId: string,
    initialData: GetGroupExpensesResponse
}

export default function ExpensesList({groupId, userId, initialData}: ExpensesListProps) {
    
    const [expenses, setExpenses] = useState(initialData.expenses);
    const [hasMore, setHasMore] = useState(initialData.hasMore)
    const [nextCursor, setNextCursor] = useState(initialData.nextCursor)
    const [loading, setLoading] = useState(false)

    const handleLoadMore = async()=>{
        if(!nextCursor || loading){
            return
        }

        setLoading(true);

        try{
            const res = await fetch(`/api/groups/${groupId}/expenses?cursor=${nextCursor}`)

            if(!res.ok){
                throw new Error("Failed to load more expenses")
            }

            const data: GetGroupExpensesResponse = await res.json();

            setExpenses((prev)=> [...prev, ...data.expenses])
            setNextCursor(data.nextCursor)
            setHasMore(data.hasMore);
        }
        finally{
            setLoading(false)
        }
    }

    return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-800">
        Expenses
      </h2>

      {expenses.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-slate-500">
            No expenses yet.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="rounded-xl border p-4 transition hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-800">
                    {expense.title}
                  </h3>

                  <div className="flex flex-col items-end">
                    <div className="h-8">
                      {expense.paidBy.id === userId && (
                        <DeleteExpenseButton
                          expenseId={expense.id}
                        />
                      )}
                    </div>

                    <span className="text-lg font-bold text-slate-700">
                      ₹{expense.amount}
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Paid by{" "}
                  <span className="font-medium text-slate-700">
                    {expense.paidBy.username}
                  </span>{" "}
                  on{" "}
                  <span className="font-medium text-slate-700">
                    {new Intl.DateTimeFormat("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(expense.createdAt))}
                    {" at "}
                    {new Intl.DateTimeFormat("en-IN", {
                      timeZone: "Asia/Kolkata",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(expense.createdAt))}
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {expense.participants.map((participant) => (
                    <span
                      key={participant.user.id}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                    >
                      {participant.user.username}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}