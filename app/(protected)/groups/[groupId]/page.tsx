import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { getGroup } from "@/lib/services/groups";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  const user = await getCurrentUser();

  try {
    const group = await getGroup(groupId, user.id);

    return (
      <div className="space-y-8">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold">
            {group.name}
          </h1>

          <p className="mt-2 text-emerald-100">
            Invite Code: {group.inviteCode}
          </p>
        </div>

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
              0
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
        <div className="rounded-2xl bg-white p-6 shadow-sm">
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