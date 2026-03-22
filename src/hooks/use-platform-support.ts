import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSupportCase,
  listSupportCases,
  type SupportCaseCreateBody,
} from "@/services/platform-support";
import { queryKeys } from "@/hooks/query-keys";

export function useSupportCasesQuery() {
  return useQuery({
    queryKey: queryKeys.supportCases,
    queryFn: listSupportCases,
  });
}

export function useCreateSupportCaseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SupportCaseCreateBody) => createSupportCase(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.supportCases });
    },
  });
}
