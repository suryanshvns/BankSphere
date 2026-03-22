import { apiRequest } from './client';
import type { NotificationItem } from './types';

export function listNotifications() {
  return apiRequest<NotificationItem[]>({
    method: 'GET',
    url: '/notifications',
  });
}
