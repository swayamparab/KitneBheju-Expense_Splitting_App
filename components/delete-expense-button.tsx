"use client"

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteExpenseButton(
    { expenseId }: { expenseId: string }
) { 

    const router = useRouter();

    const handleDeleteExpense = async()=>{

        try {

            const res = await fetch(`/api/expenses/${expenseId}`, {
                method: "DELETE"
            })

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to delete expense")
                return;
            }

            toast.success("Expense Deleted!");

            router.refresh();
        }
        catch (err) {
            toast.error("Internal server error")
        }
    }

    return (
        <button
            onClick={handleDeleteExpense}
            className="rounded-md p-1 bg-red-50 text-red-500 cursor-pointer"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    )
}