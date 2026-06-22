"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type Member = {
    user: {
        id: string;
        username: string;
    };
};

interface AddExpenseDialogProps {
    groupId: string;
    members: Member[];
    currentUserId: string;
}

export default function AddExpenseDialog({
    groupId,
    members,
    currentUserId
}: AddExpenseDialogProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [participantIds, setParticipantIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    function toggleParticipant(userId: string) {
        setParticipantIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    }

    async function handleAddExpense() {
        try {
            setLoading(true);

            const res = await fetch(
                `/api/groups/${groupId}/expenses`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        amount: Number(amount),
                        participantIds,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            toast.success(data.message);

            setTitle("");
            setAmount("");
            setParticipantIds([]);
            setOpen(false);

            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-700 hover:bg-emerald-800">
                    Add Expense
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Expense
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Expense title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                    />

                    <div>
                        <p className="mb-2 text-sm font-medium">
                            Participants
                        </p>

                        <div className="space-y-2">
                            {members
                                .filter(
                                    (member) => member.user.id !== currentUserId
                                )
                                .map((member) => (
                                    <label
                                        key={member.user.id}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={participantIds.includes(
                                                member.user.id
                                            )}
                                            onChange={() =>
                                                toggleParticipant(member.user.id)
                                            }
                                        />

                                        <span>
                                            {member.user.username}
                                        </span>
                                    </label>
                                ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleAddExpense}
                        disabled={loading}
                        className="w-full bg-emerald-700 hover:bg-emerald-800"
                    >
                        {loading
                            ? "Adding..."
                            : "Add Expense"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}