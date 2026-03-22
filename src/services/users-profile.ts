import { apiRequest } from "./client";
import type { UserMe } from "./types";
export type UserLimits = {
  daily_transfer_max?: string;
  daily_atm_max?: string;
  [key: string]: unknown;
};

/**
 * ```bash
 * curl -s -X PATCH "${API}/users/me" -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"full_name":"Alice","phone":"+15550001","notify_email":true,"notify_push":false}'
 * ```
 */
export function updateCurrentUserProfile(body: {
  full_name?: string;
  phone?: string;
  notify_email?: boolean;
  notify_push?: boolean;
}) {
  return apiRequest<UserMe>({
    method: "PATCH",
    url: "/users/me",
    data: body,
  });
}

/**
 * ```bash
 * curl -s -X POST "${API}/users/me/password" -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"current_password":"<OLD>","new_password":"<NEW>"}'
 * ```
 */
export function changeMyPassword(body: {
  current_password: string;
  new_password: string;
}) {
  return apiRequest<{ ok?: boolean }>({
    method: "POST",
    url: "/users/me/password",
    data: body,
  });
}

/**
 * ```bash
 * curl -s "${API}/users/me/limits" -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function getMyLimits() {
  return apiRequest<UserLimits>({ method: "GET", url: "/users/me/limits" });
}

/**
 * ```bash
 * curl -s -X PATCH "${API}/users/me/limits" -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"daily_transfer_max":"5000.00","daily_atm_max":"1000.00"}'
 * ```
 */
export function updateMyLimits(body: Partial<UserLimits>) {
  return apiRequest<UserLimits>({
    method: "PATCH",
    url: "/users/me/limits",
    data: body,
  });
}
