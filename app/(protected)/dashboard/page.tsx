"use client"

import { useQuery } from "@tanstack/react-query";

type Group = {
    id: string;
    name: string;
    inviteCode: string;
    _count: {
        members: number;
    };
};

export default function DashboardPage() {

    const { data, isLoading, error } = useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const res = await fetch("/api/groups")

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "failed to fetch groups")
            }

            return data
        }
    })

    if (isLoading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p>Loading groups...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p>Failed to load groups.</p>
            </div>
        );
    }

    const groups: Group[] = data.groups;

    console.log(data)

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