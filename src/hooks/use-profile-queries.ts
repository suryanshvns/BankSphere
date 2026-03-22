import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listNotifications } from "@/services/notifications";
import {
  markAllNotificationsRead,
  markNotificationAsRead,
} from "@/services/notifications-extra";
import type { NotificationItem } from "@/services/types";
import { getCurrentUser, submitKycReference } from "@/services/users";
import type { KycSubmitBody } from "@/services/users";
import { deleteAuthSession, listAuthSessions } from "@/services/auth-session";
import {
  changeMyPassword,
  getMyLimits,
  updateCurrentUserProfile,
  updateMyLimits,
} from "@/services/users-profile";
import { queryKeys } from "@/hooks/query-keys";
import { useAuthStore } from "@/store/auth-store";

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: queryKeys.userMe,
    queryFn: getCurrentUser,
  });
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () =>
      listNotifications().catch(() => [] as NotificationItem[]),
  });
}

export function useSubmitKycMutation() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (body: KycSubmitBody) => submitKycReference(body),
    onSuccess: (user) => {
      setUser(user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.userMe });
    },
  });
}

export function useMyLimitsQuery() {
  return useQuery({
    queryKey: queryKeys.userLimits,
    queryFn: getMyLimits,
  });
}

export function useAuthSessionsQuery() {
  return useQuery({
    queryKey: queryKeys.authSessions,
    queryFn: listAuthSessions,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (body: Parameters<typeof updateCurrentUserProfile>[0]) =>
      updateCurrentUserProfile(body),
    onSuccess: (user) => {
      setUser(user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.userMe });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (body: Parameters<typeof changeMyPassword>[0]) =>
      changeMyPassword(body),
  });
}

export function useUpdateLimitsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof updateMyLimits>[0]) =>
      updateMyLimits(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.userLimits });
    },
  });
}

export function useDeleteAuthSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => deleteAuthSession(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.authSessions });
    },
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}
