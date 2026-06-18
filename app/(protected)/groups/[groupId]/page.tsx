import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { getGroup, getGroupExpenses } from "@/lib/services/groups";

import AddExpenseDialog from "@/components/add-expense-dialog";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  const user = await getCurrentUser();

  try {
    const group = await getGroup(groupId, user.id);

    const expenses = await getGroupExpenses(groupId, user.id);

    return (
      <div className="space-y-3">
        {/* Hero */}
        <div className="rounded-3xl bg-linear-to-r from-emerald-700 to-emerald-600 p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold">
            {group.name}
          </h1>

          <p className="mt-2 text-emerald-100">
            Invite Code: {group.inviteCode}
          </p>
        </div>

        <AddExpenseDialog
          groupId={group.id}
          members={group.members}
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
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">
                      {expense.title}
                    </h3>

                    <span className="text-lg font-bold text-emerald-700">
                      ₹{expense.amount}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Paid by{" "}
                    <span className="font-medium text-slate-700">
                      {expense.paidBy.username}
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
      </div>
    );
  } catch {
    notFound();
  }
}