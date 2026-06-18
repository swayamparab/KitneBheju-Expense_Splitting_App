import Link from "next/link";

import { getOptionalUser } from "@/lib/auth-helpers";

export default async function Navbar() {
  const user = await getOptionalUser();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href={user ? "/dashboard" : "/"}
          className="text-xl font-bold tracking-tight text-emerald-700"
        >
          KitneBheju
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Dashboard
              </Link>

              <div className="h-5 w-px bg-slate-200" />

              <span className="text-sm font-medium text-slate-600">
                {user.username}
              </span>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
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