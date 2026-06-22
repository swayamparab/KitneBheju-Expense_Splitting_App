import JoinGroupButton from "@/components/join-group-button";
import { getGroupByInviteCode } from "@/lib/services/groups";
import { notFound } from "next/navigation";

export default async function joinGroupPage(
    { params }: { params: Promise<{ inviteCode: string }> }
) {
    const { inviteCode } = await params;

    const group = await getGroupByInviteCode(inviteCode);

    if (!group) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-md p-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold">
                    {group.name}
                </h1>

                <p className="mt-2 text-slate-500">
                    {group._count.members} members
                </p>

                <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-slate-700">
                        Members:
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {group.members.map((member) => (
                            <span
                                key={member.user.id}
                                className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                            >
                                {member.user.username}
                            </span>
                        ))}
                    </div>
                </div>

                <JoinGroupButton
                    inviteCode={inviteCode}
                />
            </div>
        </div>
    )
}