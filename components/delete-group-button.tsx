"use client"

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteGroupButton(
    { groupId }: { groupId: string }
) {

    const router = useRouter();

    const handleDeleteGroup = async () => {
        try {

            const confirmed = window.confirm("Are you sure you want to delete the group?")

            if(!confirmed){
                return;
            }

            const res = await fetch(`/api/groups/${groupId}`, {
                method: "DELETE"
            })

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to delete group")
                return;
            }

            toast.success("Group Deleted!")

            router.push("/dashboard");
            router.refresh();
        }
        catch (err) {
            toast.error("Internal server error")
        }
    }

    return (
        <button
            onClick={handleDeleteGroup}
            className="rounded-md border border-red-200 px-1.5 py-1.5 text-sm font-medium text-red-600 bg-red-50 cursor-pointer"
        >
            delete group
        </button>
    )

}