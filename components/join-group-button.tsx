"use client"

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function JoinGroupButton(
    { inviteCode }: { inviteCode: string }) {

    const router = useRouter();

    const handleJoin = async () => {
        const res = await fetch(`/api/groups/join/${inviteCode}`, {
            method: "POST"
        })

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message);
            return;
        }

        toast.success("Joined Group!");

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <button
            onClick={handleJoin}
            className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-white cursor-pointer"
        >
            Join Group
        </button>
    )
}
