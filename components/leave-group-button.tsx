"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner";

export default function LeaveGroupButton(
    { groupId }: { groupId: string }
) {

    const router = useRouter();

    async function handleLeaveGroup() {

        try {

            const confirmed = window.confirm("Are you sure you want to leave the group?")

            if (!confirmed) {
                return;
            }

            const res = await fetch(`/api/groups/${groupId}/leave`, {
                method: "DELETE"
            })

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.mesage || "Failed to leave group")
                return;
            }

            toast.success("Group Left Successfully")

            router.push("/dashboard");
            router.refresh();
        }
        catch {
            toast.error("Internal Server Error")
        }
    }

    return (
        <button
            onClick={handleLeaveGroup}
            className="rounded-md border border-red-200 px-1.5 py-1.5 text-sm font-medium text-red-600 bg-red-50 cursor-pointer"
        >
            leave group
        </button>
    )
}