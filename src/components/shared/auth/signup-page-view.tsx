"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signupSchema, type SignupFormValues } from "@/schemas/auth.schema";
import { useSignupMutation } from "@/hooks/use-auth-mutations";
import { getErrorMessage } from "@/services/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function SignupPageView() {
  const router = useRouter();
  const signupMutation = useSignupMutation();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
    mode: "onBlur",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await signupMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
        full_name: values.fullName.trim(),
      });
      toast.success("Account created");
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
          Create account
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          Open your BankSphere profile in minutes — no paperwork in the browser.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="fullName"
                    autoComplete="name"
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
                    autoComplete="new-password"
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
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Creating…" : "Sign up"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline light:text-violet-600 light:hover:text-violet-700"
          >
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
