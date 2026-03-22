import { apiPublicPost, apiRequest } from "./client";
import type { AuthTokens } from "./types";

/**
 * ```bash
 * curl -s -X POST "${API}/auth/refresh" -H "Content-Type: application/json" \
 *   -d '{"refresh_token":"..."}'
 * ```
 */
export function refreshSession(refresh_token: string) {
  return apiPublicPost<AuthTokens>("/auth/refresh", { refresh_token });
}

/**
 * ```bash
 * curl -s -X POST "${API}/auth/logout" -H "Content-Type: application/json" \
 *   -d '{"refresh_token":"..."}'
 * ```
 */
export function logoutWithRefresh(refresh_token: string) {
  return apiPublicPost<{ ok?: boolean }>("/auth/logout", { refresh_token });
}

/**
 * ```bash
 * curl -s -X POST "${API}/auth/forgot-password" -H "Content-Type: application/json" \
 *   -d '{"email":"alice@example.com"}'
 * ```
 */
export function forgotPassword(email: string) {
  return apiPublicPost<{ ok?: boolean }>("/auth/forgot-password", { email });
}

/**
 * ```bash
 * curl -s -X POST "${API}/auth/reset-password" -H "Content-Type: application/json" \
 *   -d '{"token":"<RESET_TOKEN>","new_password":"NewLongPass123"}'
 * ```
 */
export function resetPasswordWithToken(body: {
  token: string;
  new_password: string;
}) {
  return apiPublicPost<{ ok?: boolean }>("/auth/reset-password", body);
}

export type AuthSessionRow = {
  id: string;
  device_name?: string;
  ip?: string;
  created_at?: string;
  last_active_at?: string;
};

/**
 * ```bash
 * curl -s "${API}/auth/sessions" -H "Authorization: Bearer ${ACCESS_TOKEN}"
 * ```
 */
export function listAuthSessions() {
  return apiRequest<AuthSessionRow[]>({
    method: "GET",
    url: "/auth/sessions",
  });
}

/**
 * ```bash
 * curl -s -X DELETE "${API}/auth/sessions/${SESSION_ID}" \
 *   -H "Authorization: Bearer ${ACCESS_TOKEN}"
 * ```
 */
export function deleteAuthSession(sessionId: string) {
  return apiRequest<{ ok?: boolean }>({
    method: "DELETE",
    url: `/auth/sessions/${sessionId}`,
  });
}
