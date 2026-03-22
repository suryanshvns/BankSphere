import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBeneficiary,
  deleteBeneficiary,
  listBeneficiaries,
} from "@/services/beneficiaries";
import { queryKeys } from "@/hooks/query-keys";

export function useBeneficiariesQuery() {
  return useQuery({
    queryKey: queryKeys.beneficiaries,
    queryFn: listBeneficiaries,
  });
}

export function useCreateBeneficiaryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBeneficiary,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.beneficiaries });
    },
  });
}

export function useDeleteBeneficiaryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBeneficiary(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.beneficiaries });
    },
  });
}
