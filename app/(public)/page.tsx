import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Know exactly,{" "}
          <span className="text-emerald-600">
            KitneBheju
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Split expenses with friends, roommates, and travel groups.
          Track balances and settle up without the confusion.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-lg bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Login
          </Link>
        </div>

        <div className="mt-20 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-slate-900">
              Create Groups
            </h3>

            <p className="text-sm text-slate-600">
              Create groups for trips, flats, college projects, or office outings.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-slate-900">
              Split Expenses
            </h3>

            <p className="text-sm text-slate-600">
              Record expenses and automatically calculate who owes whom.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-slate-900">
              Settle Easily
            </h3>

            <p className="text-sm text-slate-600">
              See balances instantly and settle up without manual calculations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}