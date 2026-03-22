import { useMutation } from "@tanstack/react-query";
import { login, signup } from "@/services/auth";
import type { LoginBody, SignupBody } from "@/services/auth";
import {
  forgotPassword,
  resetPasswordWithToken,
} from "@/services/auth-session";
import { getCurrentUser } from "@/services/users";
import { setAccessToken } from "@/services/session";
import { useAuthStore } from "@/store/auth-store";

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (body: LoginBody) => {
      const tokens = await login(body);
      setAccessToken(tokens.access_token);
      const user = await getCurrentUser();
      return {
        token: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        user,
      };
    },
    onSuccess: (data) => {
      useAuthStore
        .getState()
        .setSession(data.token, data.user, data.refreshToken);
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (body: SignupBody) => {
      const tokens = await signup(body);
      setAccessToken(tokens.access_token);
      const user = await getCurrentUser();
      return {
        token: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        user,
      };
    },
    onSuccess: (data) => {
      useAuthStore
        .getState()
        .setSession(data.token, data.user, data.refreshToken);
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (body: Parameters<typeof resetPasswordWithToken>[0]) =>
      resetPasswordWithToken(body),
  });
}
