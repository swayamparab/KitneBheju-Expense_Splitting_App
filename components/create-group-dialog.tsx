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

export default function CreateGroupDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateGroup() {
    if (!name.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create group");
      }

      setOpen(false);
      setName("");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="
        border border-emerald-800
        bg-emerald-700
        text-white
        shadow-sm
        hover:bg-emerald-800
      "
        >
          Create Group
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Create Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Enter group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
          border-slate-300
          focus-visible:ring-emerald-700
        "
          />

          <Button
            onClick={handleCreateGroup}
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
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}