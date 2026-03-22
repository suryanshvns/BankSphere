import { Suspense } from "react";
import { ResetPasswordPageView } from "@/components/shared/auth/reset-password-page-view";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-zinc-500">Loading reset form…</p>
      }
    >
      <ResetPasswordPageView />
    </Suspense>
  );
}
