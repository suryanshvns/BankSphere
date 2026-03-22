import { useMutation } from "@tanstack/react-query";
import {
  submitBusinessProfile,
  type BusinessProfileBody,
} from "@/services/platform-business";

export function useSubmitBusinessProfileMutation() {
  return useMutation({
    mutationFn: (body: BusinessProfileBody) => submitBusinessProfile(body),
  });
}
