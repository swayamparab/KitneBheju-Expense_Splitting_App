import { redirect } from "next/navigation";

import { getUserFromToken } from "@/lib/auth-helpers";
import Navbar from "@/components/navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await getUserFromToken();

    return(<>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        {children}
      </main>
    </>)
  } catch {
    redirect("/login");
  }
}