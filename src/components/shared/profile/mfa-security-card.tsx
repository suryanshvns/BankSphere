"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useMfaDisableMutation,
  useMfaEnrollConfirmMutation,
  useMfaEnrollStartMutation,
} from "@/hooks/use-platform-mfa";
import { getErrorMessage } from "@/services/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MfaSecurityCard() {
  const startMutation = useMfaEnrollStartMutation();
  const confirmMutation = useMfaEnrollConfirmMutation();
  const disableMutation = useMfaDisableMutation();
  const [enrollSecret, setEnrollSecret] = useState<string | null>(null);
  const [enrollUrl, setEnrollUrl] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");

  return (
    <GlassCard>
      <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
        Two-factor (TOTP)
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        POST /platform/mfa/enroll/start · confirm · disable
      </p>

      <div className="mt-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={startMutation.isPending}
            onClick={async () => {
              try {
                const data = await startMutation.mutateAsync();
                setEnrollSecret(
                  typeof data.secret === "string" ? data.secret : null
                );
                setEnrollUrl(
                  typeof data.otpauth_url === "string"
                    ? data.otpauth_url
                    : null
                );
                toast.success("Enrollment started — add the secret in your app");
              } catch (err) {
                toast.error(getErrorMessage(err));
              }
            }}
          >
            {startMutation.isPending ? "Starting…" : "Start enroll"}
          </Button>
        </div>

        {enrollSecret ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs light:border-zinc-200 light:bg-zinc-50">
            <p className="font-medium text-zinc-200 light:text-zinc-800">
              Manual secret
            </p>
            <p className="mt-1 break-all font-mono text-zinc-400">
              {enrollSecret}
            </p>
            {enrollUrl ? (
              <>
                <p className="mt-3 font-medium text-zinc-200 light:text-zinc-800">
                  otpauth URL
                </p>
                <p className="mt-1 break-all font-mono text-zinc-400">
                  {enrollUrl}
                </p>
              </>
            ) : null}
          </div>
        ) : null}

        <div>
          <Label htmlFor="mfa-code">Confirm with 6-digit code</Label>
          <Input
            id="mfa-code"
            className="mt-1.5"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={8}
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
          />
          <Button
            type="button"
            className="mt-3"
            disabled={confirmMutation.isPending || totpCode.length < 6}
            onClick={async () => {
              try {
                await confirmMutation.mutateAsync({ code: totpCode });
                toast.success("MFA enabled");
                setTotpCode("");
                setEnrollSecret(null);
                setEnrollUrl(null);
              } catch (err) {
                toast.error(getErrorMessage(err));
              }
            }}
          >
            {confirmMutation.isPending ? "Confirming…" : "Confirm enroll"}
          </Button>
        </div>

        <div className="border-t border-white/10 pt-4 light:border-zinc-200">
          <Label htmlFor="mfa-disable-pw">Disable MFA (password)</Label>
          <Input
            id="mfa-disable-pw"
            type="password"
            autoComplete="current-password"
            className="mt-1.5"
            value={disablePassword}
            onChange={(e) => setDisablePassword(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            className="mt-3 text-rose-400 hover:text-rose-300"
            disabled={disableMutation.isPending || !disablePassword}
            onClick={async () => {
              try {
                await disableMutation.mutateAsync({
                  password: disablePassword,
                });
                toast.success("MFA disabled");
                setDisablePassword("");
              } catch (err) {
                toast.error(getErrorMessage(err));
              }
            }}
          >
            {disableMutation.isPending ? "Disabling…" : "Disable MFA"}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
