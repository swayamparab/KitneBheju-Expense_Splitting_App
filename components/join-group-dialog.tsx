"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function JoinGroupDialog() {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [inviteCode, setInviteCode] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleJoinGroup() {
        if (!inviteCode.trim()) return;

        try {
            setLoading(true);

            const res = await fetch(
                `/api/groups/join/${inviteCode.trim().toUpperCase()}`,
                {
                    method: "POST",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            toast.success("Group created successfully");

            setInviteCode("");
            setOpen(false);

            router.refresh();
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="
        border-slate-300
        text-slate-700
        hover:bg-slate-100
      "
                >
                    Join Group
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-slate-800">
                        Join Group
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Enter invite code"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="
          border-slate-300
          focus-visible:ring-emerald-700
        "
                    />

                    <Button
                        onClick={handleJoinGroup}
                        disabled={loading}
                        className="
          w-full
          border border-emerald-800
          bg-emerald-700
          text-white
          shadow-sm
          hover:bg-emerald-800
        "
                    >
                        {loading ? "Joining..." : "Join Group"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}