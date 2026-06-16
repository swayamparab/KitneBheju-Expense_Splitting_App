import Link from "next/link";

import { getOptionalUser } from "@/lib/auth-helpers";

export default async function Navbar() {
  const user = await getOptionalUser();

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href={user ? "/dashboard" : "/"}
          className="text-xl font-bold text-emerald-600"
        >
          KitneBheju
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>

              <span className="text-sm text-muted-foreground">
                {user.username}
              </span>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}