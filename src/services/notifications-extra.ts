import { apiRequest } from "./client";
import type { NotificationItem } from "./types";

/**
 * ```bash
 * curl -s -X PATCH "${API}/notifications/${ID}/read" \
 *   -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function markNotificationAsRead(notificationId: string) {
  return apiRequest<NotificationItem>({
    method: "PATCH",
    url: `/notifications/${notificationId}/read`,
  });
}

/**
 * ```bash
 * curl -s -X POST "${API}/notifications/read-all" \
 *   -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function markAllNotificationsRead() {
  return apiRequest<{ ok?: boolean }>({
    method: "POST",
    url: "/notifications/read-all",
  });
}
