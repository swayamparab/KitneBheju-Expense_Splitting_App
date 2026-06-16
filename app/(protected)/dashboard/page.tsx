import { getCurrentUser, getUserFromToken } from "@/lib/auth-helpers";
import { getUserGroups } from "@/lib/services/groups";

export default async function DashboardPage() {

    const user = await getCurrentUser();

    const groups = await getUserGroups(user.id);

    return (
        <div className="p-6">
            <h1 className="mb-6 text-3xl font-bold">
                Dashboard
            </h1>

            {groups.length === 0 ? (
                <div className="rounded-lg border p-6">
                    <h2 className="text-lg font-semibold">
                        No groups yet
                    </h2>

                    <p className="text-muted-foreground">
                        Create a group or join one using an invite code.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    <h1>{user.username}</h1>
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className="rounded-lg border p-4"
                        >
                            <h2 className="text-lg font-semibold">
                                {group.name}
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Invite Code: {group.inviteCode}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                Members: {group._count.members}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}