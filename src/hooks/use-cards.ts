import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelCard,
  createCard,
  listCards,
  patchCardFreeze,
} from "@/services/cards";
import { queryKeys } from "@/hooks/query-keys";

export function useCardsQuery() {
  return useQuery({
    queryKey: queryKeys.cards,
    queryFn: listCards,
  });
}

export function useCreateCardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cards });
    },
  });
}

export function usePatchCardFreezeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { cardId: string; is_frozen: boolean }) =>
      patchCardFreeze(args.cardId, args.is_frozen),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cards });
    },
  });
}

export function useCancelCardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => cancelCard(cardId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cards });
    },
  });
}
