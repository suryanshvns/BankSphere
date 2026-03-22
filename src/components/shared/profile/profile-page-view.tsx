"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { kycSchema, type KycFormValues } from "@/schemas/kyc.schema";
import {
  useAuthSessionsQuery,
  useChangePasswordMutation,
  useCurrentUserQuery,
  useDeleteAuthSessionMutation,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useMyLimitsQuery,
  useNotificationsQuery,
  useSubmitKycMutation,
  useUpdateLimitsMutation,
  useUpdateProfileMutation,
} from "@/hooks/use-profile-queries";
import { getErrorMessage } from "@/services/client";
import type { UserLimits } from "@/services/users-profile";
import type { UserMe } from "@/services/types";
import { useAuthStore } from "@/store/auth-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/badge";
import { KybBusinessCard } from "@/components/shared/profile/kyb-business-card";
import { MfaSecurityCard } from "@/components/shared/profile/mfa-security-card";
import { PrivacyExportCard } from "@/components/shared/profile/privacy-export-card";

const kycDefaults: KycFormValues = {
  referenceId: "DOC-2026-CUST-0001",
};

function ProfileEditCard({ user }: { user: UserMe }) {
  const updateProfileMutation = useUpdateProfileMutation();
  const [fullName, setFullName] = useState(user.full_name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [notifyEmail, setNotifyEmail] = useState(user.notify_email !== false);
  const [notifyPush, setNotifyPush] = useState(Boolean(user.notify_push));

  return (
    <GlassCard>
      <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
        Profile
      </p>
      <p className="mt-1 text-xs text-zinc-500">PATCH /users/me</p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="fn">Full name</Label>
          <Input
            id="fn"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="ph">Phone</Label>
          <Input
            id="ph"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300 light:text-zinc-700">
          <input
            type="checkbox"
            checked={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.checked)}
            className="rounded border-white/20"
          />
          Email notifications
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300 light:text-zinc-700">
          <input
            type="checkbox"
            checked={notifyPush}
            onChange={(e) => setNotifyPush(e.target.checked)}
            className="rounded border-white/20"
          />
          Push notifications
        </label>
        <Button
          type="button"
          disabled={updateProfileMutation.isPending}
          onClick={async () => {
            try {
              await updateProfileMutation.mutateAsync({
                full_name: fullName.trim(),
                phone: phone.trim() || undefined,
                notify_email: notifyEmail,
                notify_push: notifyPush,
              });
              toast.success("Profile updated");
            } catch (err) {
              toast.error(getErrorMessage(err));
            }
          }}
        >
          {updateProfileMutation.isPending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </GlassCard>
  );
}

function LimitsEditCard({ limits }: { limits: UserLimits }) {
  const updateLimitsMutation = useUpdateLimitsMutation();
  const [dailyTransferMax, setDailyTransferMax] = useState(
    limits.daily_transfer_max != null ? String(limits.daily_transfer_max) : ""
  );
  const [dailyAtmMax, setDailyAtmMax] = useState(
    limits.daily_atm_max != null ? String(limits.daily_atm_max) : ""
  );

  return (
    <GlassCard>
      <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
        Transfer limits
      </p>
      <p className="mt-1 text-xs text-zinc-500">GET /users/me/limits · PATCH</p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="dtm">Daily transfer max</Label>
          <Input
            id="dtm"
            value={dailyTransferMax}
            onChange={(e) => setDailyTransferMax(e.target.value)}
            className="mt-1.5"
            inputMode="decimal"
          />
        </div>
        <div>
          <Label htmlFor="dam">Daily ATM max</Label>
          <Input
            id="dam"
            value={dailyAtmMax}
            onChange={(e) => setDailyAtmMax(e.target.value)}
            className="mt-1.5"
            inputMode="decimal"
          />
        </div>
        <Button
          type="button"
          disabled={updateLimitsMutation.isPending}
          onClick={async () => {
            try {
              await updateLimitsMutation.mutateAsync({
                daily_transfer_max: dailyTransferMax.trim() || undefined,
                daily_atm_max: dailyAtmMax.trim() || undefined,
              });
              toast.success("Limits updated");
            } catch (err) {
              toast.error(getErrorMessage(err));
            }
          }}
        >
          {updateLimitsMutation.isPending ? "Saving…" : "Save limits"}
        </Button>
      </div>
    </GlassCard>
  );
}

export function ProfilePageView() {
  const setUser = useAuthStore((s) => s.setUser);
  const userQuery = useCurrentUserQuery();
  const limitsQuery = useMyLimitsQuery();
  const sessionsQuery = useAuthSessionsQuery();
  const notificationsQuery = useNotificationsQuery();
  const kycMutation = useSubmitKycMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const deleteSessionMutation = useDeleteAuthSessionMutation();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: kycDefaults,
  });

  useEffect(() => {
    if (userQuery.isSuccess && userQuery.data) {
      setUser(userQuery.data);
    }
  }, [userQuery.isSuccess, userQuery.data, setUser]);

  useEffect(() => {
    if (userQuery.isError && userQuery.error) {
      toast.error(getErrorMessage(userQuery.error));
    }
  }, [userQuery.isError, userQuery.error]);

  useEffect(() => {
    if (limitsQuery.isError && limitsQuery.error) {
      toast.error(getErrorMessage(limitsQuery.error));
    }
  }, [limitsQuery.isError, limitsQuery.error]);

  useEffect(() => {
    if (sessionsQuery.isError && sessionsQuery.error) {
      toast.error(getErrorMessage(sessionsQuery.error));
    }
  }, [sessionsQuery.isError, sessionsQuery.error]);

  const handleKycSubmit = form.handleSubmit(async (values) => {
    try {
      await kycMutation.mutateAsync({
        reference_id: values.referenceId.trim(),
      });
      toast.success("KYC reference submitted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  });

  const user = userQuery.data;
  const isUserLoading = userQuery.isPending;
  const notes = notificationsQuery.data;
  const isNotesLoading = notificationsQuery.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900">
          Profile
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          Identity, security, KYB, privacy, KYC, and notifications
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            User info
          </p>
          {isUserLoading ? (
            <div className="mt-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ) : (
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase text-zinc-500">Name</dt>
                <dd className="text-zinc-100 light:text-zinc-900">
                  {user?.full_name ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-500">Email</dt>
                <dd className="text-zinc-100 light:text-zinc-900">
                  {user?.email ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-500">User ID</dt>
                <dd className="break-all font-mono text-xs text-zinc-400">
                  {user?.id ?? "—"}
                </dd>
              </div>
            </dl>
          )}
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            KYC status
          </p>
          {isUserLoading ? (
            <Skeleton className="mt-4 h-10 w-32" />
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StatusBadge status={user?.kyc_status ?? "UNKNOWN"} />
              {user?.kyc_reference_id ? (
                <span className="text-xs text-zinc-500">
                  Ref: {user.kyc_reference_id}
                </span>
              ) : null}
            </div>
          )}
          <form className="mt-6 space-y-3" onSubmit={handleKycSubmit}>
            <div>
              <Label htmlFor="ref">Reference ID</Label>
              <Controller
                name="referenceId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="ref"
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
            <Button type="submit" disabled={kycMutation.isPending}>
              {kycMutation.isPending ? "Submitting…" : "Submit KYC reference"}
            </Button>
          </form>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
              Notifications
            </p>
            <p className="mt-1 text-xs text-zinc-500">GET /notifications</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="text-xs"
            disabled={markAllReadMutation.isPending}
            onClick={async () => {
              try {
                await markAllReadMutation.mutateAsync();
                toast.success("Marked all read");
              } catch (err) {
                toast.error(getErrorMessage(err));
              }
            }}
          >
            Read all
          </Button>
        </div>
        <ul className="mt-4 space-y-2">
          {isNotesLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            (notes ?? []).map((n) => (
              <li
                key={n.id}
                className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm light:border-zinc-200 light:bg-white/80"
              >
                <div className="min-w-0">
                  <p className="font-medium text-zinc-100 light:text-zinc-900">
                    {n.title ?? "Notice"}{" "}
                    {n.read ? (
                      <span className="text-xs font-normal text-zinc-500">
                        (read)
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-zinc-500">{n.message}</p>
                </div>
                {!n.read ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="shrink-0 px-2 py-1 text-xs"
                    disabled={markReadMutation.isPending}
                    onClick={async () => {
                      try {
                        await markReadMutation.mutateAsync(n.id);
                        toast.success("Marked read");
                      } catch (err) {
                        toast.error(getErrorMessage(err));
                      }
                    }}
                  >
                    Mark read
                  </Button>
                ) : null}
              </li>
            ))
          )}
          {!isNotesLoading && (notes?.length ?? 0) === 0 ? (
            <li className="text-sm text-zinc-500">No notifications</li>
          ) : null}
        </ul>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {user ? (
          <ProfileEditCard key={userQuery.dataUpdatedAt} user={user} />
        ) : (
          <GlassCard>
            <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
              Profile
            </p>
            <Skeleton className="mt-4 h-32 w-full" />
          </GlassCard>
        )}

        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Password
          </p>
          <p className="mt-1 text-xs text-zinc-500">POST /users/me/password</p>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="cpw">Current</Label>
              <Input
                id="cpw"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="npw">New</Label>
              <Input
                id="npw"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button
              type="button"
              disabled={changePasswordMutation.isPending}
              onClick={async () => {
                try {
                  await changePasswordMutation.mutateAsync({
                    current_password: currentPassword,
                    new_password: newPassword,
                  });
                  toast.success("Password changed");
                  setCurrentPassword("");
                  setNewPassword("");
                } catch (err) {
                  toast.error(getErrorMessage(err));
                }
              }}
            >
              {changePasswordMutation.isPending ? "Updating…" : "Change password"}
            </Button>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {limitsQuery.isPending ? (
          <GlassCard>
            <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
              Transfer limits
            </p>
            <Skeleton className="mt-4 h-16 w-full" />
          </GlassCard>
        ) : limitsQuery.data ? (
          <LimitsEditCard
            key={limitsQuery.dataUpdatedAt}
            limits={limitsQuery.data}
          />
        ) : (
          <GlassCard>
            <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
              Transfer limits
            </p>
            <p className="mt-4 text-sm text-zinc-500">Limits unavailable</p>
          </GlassCard>
        )}

        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Sessions
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            GET /auth/sessions · DELETE …/{"{id}"}
          </p>
          <ul className="mt-4 space-y-2">
            {sessionsQuery.isPending ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              (sessionsQuery.data ?? []).map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs light:border-zinc-200 light:bg-white/80"
                >
                  <div className="min-w-0 font-mono text-zinc-300 light:text-zinc-800">
                    <p className="break-all">{s.id}</p>
                    <p className="text-zinc-500">
                      {s.device_name ?? s.ip ?? "Session"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-2 py-1 text-xs text-rose-400 hover:text-rose-300"
                    disabled={deleteSessionMutation.isPending}
                    onClick={async () => {
                      try {
                        await deleteSessionMutation.mutateAsync(s.id);
                        toast.success("Session revoked");
                      } catch (err) {
                        toast.error(getErrorMessage(err));
                      }
                    }}
                  >
                    Revoke
                  </Button>
                </li>
              ))
            )}
            {!sessionsQuery.isPending &&
            (sessionsQuery.data?.length ?? 0) === 0 ? (
              <li className="text-sm text-zinc-500">No sessions listed</li>
            ) : null}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MfaSecurityCard />
        <KybBusinessCard />
      </div>
      <PrivacyExportCard />
    </div>
  );
}
