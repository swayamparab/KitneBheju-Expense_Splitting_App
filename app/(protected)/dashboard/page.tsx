import { Users } from "lucide-react";

import { getCurrentUser } from "@/lib/auth-helpers";
import { getUserGroups } from "@/lib/services/groups";

import CreateGroupDialog from "@/components/create-group-dialog";
import JoinGroupDialog from "@/components/join-group-dialog";

import Link from "next/link";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    const groups = await getUserGroups(user.id);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Hero Section */}
                <div className="rounded-3xl bg-emerald-600 p-8 text-white shadow-lg">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold md:text-4xl">
                                Welcome, {user.username}
                            </h1>

                            <p className="mt-2 text-emerald-100">
                                Manage your groups, track shared expenses, and know exactly
                                kitne bheju.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <CreateGroupDialog />
                            <JoinGroupDialog />
                        </div>
                    </div>
                </div>

                {/* Groups Section */}
                <section>
                    <div className="mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5 text-emerald-600" />

                        <h2 className="text-2xl font-semibold text-slate-800">
                            My Groups
                        </h2>
                    </div>

                    {groups.length === 0 ? (
                        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
                            <h3 className="text-xl font-semibold text-slate-800">
                                No groups yet
                            </h3>

                            <p className="mt-2 text-slate-500">
                                Create a group or join one using an invite code.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {groups.map((group) => (
                                <Link
                                    key={group.id}
                                    href={`/groups/${group.id}`}
                                    className="block"
                                >
                                    <div
                                        key={group.id}
                                        className="cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-slate-800">
                                                {group.name}
                                            </h3>
                                        </div>

                                        <div className="space-y-2 text-sm text-slate-500">
                                            <p>
                                                <span className="font-medium text-slate-700">
                                                    Invite Code:
                                                </span>{" "}
                                                {group.inviteCode}
                                            </p>

                                            <p>
                                                <span className="font-medium text-slate-700">
                                                    Members:
                                                </span>{" "}
                                                {group._count.members}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}