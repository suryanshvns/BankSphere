import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyForLoan, listLoans } from "@/services/loans";
import type { LoanApplyBody } from "@/services/loans";
import { queryKeys } from "@/hooks/query-keys";

export function useLoansQuery() {
  return useQuery({
    queryKey: queryKeys.loans,
    queryFn: listLoans,
  });
}

export function useApplyLoanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LoanApplyBody) => applyForLoan(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans });
    },
  });
}
