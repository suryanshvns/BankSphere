import { apiRequest } from "./client";

export type MfaEnrollStartResult = {
  secret?: string;
  otpauth_url?: string;
  [key: string]: unknown;
};

export function startMfaEnroll() {
  return apiRequest<MfaEnrollStartResult>({
    method: "POST",
    url: "/platform/mfa/enroll/start",
  });
}

export function confirmMfaEnroll(body: { code: string }) {
  return apiRequest<Record<string, unknown>>({
    method: "POST",
    url: "/platform/mfa/enroll/confirm",
    data: body,
  });
}

export function disableMfa(body: { password: string }) {
  return apiRequest<Record<string, unknown>>({
    method: "POST",
    url: "/platform/mfa/disable",
    data: body,
  });
}
