import { getUserFromToken } from "@/lib/auth-helpers";
import { getGroup, getGroupBalances, getGroupExpenses, getGroupSettlements } from "@/lib/services/groups";

import AddExpenseDialog from "@/components/add-expense-dialog";

import { ArrowRight } from "lucide-react";

import DeleteGroupButton from "@/components/delete-group-button";

import CopyInviteLinkButton from "@/components/copy-invite-link-button";
import LeaveGroupButton from "@/components/leave-group-button";
import ExpensesList from "@/components/expenses-list";

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
      expensesData,
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

            {group.owner.id === userId ? (
              <DeleteGroupButton groupId={groupId} />
            ) : (
              <LeaveGroupButton groupId={groupId} />
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
              Owner
            </p>

            <h2 className="mt-2 text-xl font-semibold text-slate-800">
              {group.owner.username}
            </h2>
          </div>
        </div>

        {/* Expenses */}
        <ExpensesList
          groupId={groupId}
          userId={userId}
          initialData={expensesData}
        />

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
  } catch (err) {
    console.log(err);
    throw err;
  }
}