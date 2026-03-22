"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/hooks/use-auth-mutations";
import { getErrorMessage } from "@/services/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPageView() {
  const mutation = useForgotPasswordMutation();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "alice@example.com" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values.email.trim());
      toast.success("If that email exists, reset instructions were sent.");
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
          Forgot password
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          POST /auth/forgot-password — we&apos;ll email a reset link when the
          account exists.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
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
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-zinc-500">
          <Link
            href="/login"
            className="font-semibold text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline light:text-violet-600"
          >
            Back to sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
