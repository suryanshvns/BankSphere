import { useMutation } from "@tanstack/react-query";
import {
  authorizeCard,
  captureCardAuthorization,
  reverseCardAuthorization,
  type CardAuthorizeBody,
  type CardCaptureBody,
} from "@/services/platform-cards";

export function useCardAuthorizeMutation() {
  return useMutation({
    mutationFn: (args: { cardId: string; body: CardAuthorizeBody }) =>
      authorizeCard(args.cardId, args.body),
  });
}

export function useCardCaptureMutation() {
  return useMutation({
    mutationFn: (args: { cardId: string; body: CardCaptureBody }) =>
      captureCardAuthorization(args.cardId, args.body),
  });
}

export function useCardReverseMutation() {
  return useMutation({
    mutationFn: (authorizationId: string) =>
      reverseCardAuthorization(authorizationId),
  });
}
