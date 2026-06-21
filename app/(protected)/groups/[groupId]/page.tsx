import { notFound } from "next/navigation";

import { getCurrentUser, getUserFromToken } from "@/lib/auth-helpers";
import { getGroup, getGroupBalances, getGroupExpenses, getGroupSettlements } from "@/lib/services/groups";

import AddExpenseDialog from "@/components/add-expense-dialog";

import { ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";

import DeleteGroupButton from "@/components/delete-group-button";
import DeleteExpenseButton from "@/components/delete-expense-button";

import CopyInviteLinkButton from "@/components/copy-invite-link-button";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  const userId = await getUserFromToken();

  try {
    const [
      group,
      expenses,
      balances,
      settlements,
    ] = await Promise.all([
      getGroup(groupId, userId),
      getGroupExpenses(groupId, userId),
      getGroupBalances(groupId, userId),
      getGroupSettlements(groupId, userId),
    ]);

    return (
      <div className="space-y-3">
        {/* Hero */}
        <div className="rounded-3xl bg-linear-to-r from-emerald-700 to-emerald-600 p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                {group.name}
              </h1>

              <div className="flex column">
                <p className="text-emerald-100">
                  Invite Code: {group.inviteCode}
                </p>
                <CopyInviteLinkButton inviteCode={group.inviteCode} />

              </div>
            </div>

            {group.owner.id === userId && (
              <DeleteGroupButton groupId={groupId} />
            )}

          </div>
        </div>

        <AddExpenseDialog
          groupId={group.id}
          members={group.members}
          currentUserId={userId}
        />
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Members
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {group.members.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Expenses
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {expenses.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Owner
            </p>

            <h2 className="mt-2 text-xl font-semibold text-slate-800">
              {group.owner.username}
            </h2>
          </div>
        </div>

        {/* Expenses */}
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
                    </span>
                    {" "}on {" "}
                    <span className="font-medium text-slate-700">
                      {new Date(expense.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                      {" at "}
                      {new Date(expense.createdAt).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {expense.participants.map(
                      (participant) => (
                        <span
                          key={participant.user.id}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                        >
                          {participant.user.username}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settlements */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Settlements
          </h2>

          {settlements.length === 0 ? (
            <div className="rounded-xl border border-dashed p-4 text-center">
              <p className="text-slate-500">
                Everyone is settled up.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.map((settlement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-800">
                      {settlement.from}
                    </span>

                    <ArrowRight className="h-4 w-4 text-slate-400" />

                    <span className="font-medium text-slate-800">
                      {settlement.to}
                    </span>
                  </div>

                  <span className="font-bold text-slate-600">
                    ₹{settlement.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Balances */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Balances
          </h2>

          {balances.length === 0 ? (
            <p className="text-slate-500">
              No balances yet
            </p>
          ) : (
            <div className="space-y-3">
              {balances.map((balance) => (
                <div
                  key={balance.userId}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <span className="font-medium">
                    {balance.username}
                  </span>

                  <span
                    className={`font-semibold ${balance.balance > 0
                      ? "text-green-600"
                      : balance.balance < 0
                        ? "text-red-600"
                        : "text-slate-500"
                      }`}
                  >
                    {balance.balance > 0 ? "+" : ""}
                    ₹{balance.balance}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>



        {/* Members */}
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              Members
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {group.members.map((member) => (
              <div
                key={member.user.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="font-semibold text-slate-800">
                  {member.user.username}
                </p>

                <p className="text-sm text-slate-500">
                  {member.user.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}