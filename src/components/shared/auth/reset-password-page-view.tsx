"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/hooks/use-auth-mutations";
import { getErrorMessage } from "@/services/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const schema = z
  .object({
    token: z.string().min(1, "Token required"),
    new_password: z.string().min(8, "At least 8 characters"),
    confirm: z.string().min(1, "Confirm password"),
  })
  .refine((v) => v.new_password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordPageView() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";
  const mutation = useResetPasswordMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: tokenFromUrl,
      new_password: "",
      confirm: "",
    },
  });

  useEffect(() => {
    if (tokenFromUrl) {
      form.setValue("token", tokenFromUrl);
    }
  }, [tokenFromUrl, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        token: values.token.trim(),
        new_password: values.new_password,
      });
      toast.success("Password updated — you can sign in");
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
          Reset password
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          POST /auth/reset-password with the token from your email.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <Label htmlFor="token">Reset token</Label>
            <Controller
              name="token"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="token"
                    className="mt-1.5 font-mono text-xs"
                    placeholder="Paste token"
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
            <Label htmlFor="np">New password</Label>
            <Controller
              name="new_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="np"
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
          <div>
            <Label htmlFor="cf">Confirm</Label>
            <Controller
              name="confirm"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="cf"
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
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Updating…" : "Set new password"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-zinc-500">
          <Link
            href="/login"
            className="font-semibold text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline light:text-violet-600"
          >
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
