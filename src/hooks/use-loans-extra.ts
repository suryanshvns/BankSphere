import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLoanSchedule,
  listLoanInstallments,
  listLoanProducts,
  payLoanInstallment,
  prepayLoan,
} from "@/services/loans-extra";
import { queryKeys } from "@/hooks/query-keys";

export function useLoanProductsQuery() {
  return useQuery({
    queryKey: queryKeys.loanProducts,
    queryFn: listLoanProducts,
  });
}

export function useLoanScheduleQuery(loanId: string | null) {
  return useQuery({
    queryKey: loanId
      ? queryKeys.loanSchedule(loanId)
      : ["loans", "schedule", "none"],
    queryFn: () => getLoanSchedule(loanId as string),
    enabled: Boolean(loanId),
  });
}

export function usePrepayLoanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { loanId: string; amount: string }) =>
      prepayLoan(args.loanId, args.amount),
    onSuccess: (_data, args) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.loanSchedule(args.loanId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.loanInstallments(args.loanId),
      });
    },
  });
}

export function useLoanInstallmentsQuery(loanId: string | null) {
  return useQuery({
    queryKey: loanId
      ? queryKeys.loanInstallments(loanId)
      : ["loans", "installments", "none"],
    queryFn: () => listLoanInstallments(loanId as string),
    enabled: Boolean(loanId),
  });
}

export function usePayLoanInstallmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      loanId: string;
      installmentNo: number;
      from_account_id: string;
    }) =>
      payLoanInstallment(
        args.loanId,
        args.installmentNo,
        args.from_account_id
      ),
    onSuccess: (_data, args) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.loanSchedule(args.loanId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.loanInstallments(args.loanId),
      });
    },
  });
}
