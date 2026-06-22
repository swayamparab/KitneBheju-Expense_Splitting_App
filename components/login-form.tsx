"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { loginSchema } from "@/lib/validation";
import type { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
      router.refresh();

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Login</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Input
              placeholder="Username or Email"
              {...register("identifier")}
            />

            {errors.identifier && (
              <p className="mt-1 text-sm text-red-500">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-emerald-700 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}