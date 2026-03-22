import { AuthLayoutFrame } from "@/components/shared/auth-layout-frame";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutFrame>{children}</AuthLayoutFrame>;
}
