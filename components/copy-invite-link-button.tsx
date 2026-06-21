"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function CopyInviteLinkButton({
  inviteCode,
}: {
  inviteCode: string;
}) {
  const handleCopy = async () => {
    const inviteLink =
      `${window.location.origin}/groups/join/${inviteCode}`;

    await navigator.clipboard.writeText(
      inviteLink
    );

    toast.success("Invite link copied!");
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg bg-white/10 mx-2 transition hover:bg-white/20 cursor-pointer"
    >
      <Copy className="h-4 w-4" />
    </button>
  );
}