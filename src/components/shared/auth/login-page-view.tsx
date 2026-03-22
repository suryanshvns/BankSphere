"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { useLoginMutation } from "@/hooks/use-auth-mutations";
import { useHealthQuery } from "@/hooks/use-health-query";
import { getErrorMessage } from "@/services/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const defaultValues: LoginFormValues = {
  email: "alice@example.com",
  password: "User123456!",
};

export function LoginPageView() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const healthQuery = useHealthQuery();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
    mode: "onBlur",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
      });
      toast.success("Welcome back");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  });

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -right-2 -top-12 flex justify-end">
        <ThemeToggle />
      </div>
      <GlassCard highlight className="shadow-2xl shadow-cyan-950/20 light:shadow-indigo-100/60">
        <h1 className="text-2xl font-bold tracking-tight text-white light:text-zinc-900">
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          Welcome back — secure access to your BankSphere account.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="mt-1.5"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error ? (
                    <p className="mt-1 text-xs text-rose-400">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </>
              )}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="mt-1.5"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error ? (
                    <p className="mt-1 text-xs text-rose-400">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in…" : "Continue"}
          </Button>
          <p className="text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline light:text-violet-600"
            >
              Forgot password?
            </Link>
          </p>
        </form>
        <p className="mt-5 rounded-lg border border-white/5 bg-white/3 px-3 py-2 text-center text-[11px] font-medium text-zinc-500 light:border-zinc-200/80 light:bg-zinc-50 light:text-zinc-600">
          {healthQuery.isPending
            ? "Checking API…"
            : healthQuery.isSuccess
              ? "● API online"
              : "○ API unreachable — check backend / .env"}
        </p>
        <p className="mt-5 text-center text-sm text-zinc-500">
          No account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline light:text-violet-600 light:hover:text-violet-700"
          >
            Create one
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
