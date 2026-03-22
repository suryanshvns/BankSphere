import { useMutation } from "@tanstack/react-query";
import {
  confirmMfaEnroll,
  disableMfa,
  startMfaEnroll,
} from "@/services/platform-mfa";

export function useMfaEnrollStartMutation() {
  return useMutation({
    mutationFn: startMfaEnroll,
  });
}

export function useMfaEnrollConfirmMutation() {
  return useMutation({
    mutationFn: confirmMfaEnroll,
  });
}

export function useMfaDisableMutation() {
  return useMutation({
    mutationFn: disableMfa,
  });
}
