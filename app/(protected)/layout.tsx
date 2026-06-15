import { redirect } from "next/navigation";

import { getUserFromToken } from "@/lib/auth-helpers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await getUserFromToken();

    return <>{children}</>;
  } catch {
    redirect("/login");
  }
}