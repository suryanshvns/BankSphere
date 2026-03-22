import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/services/health";
import { queryKeys } from "@/hooks/query-keys";

export function useHealthQuery() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: getHealth,
    staleTime: 60_000,
    retry: 1,
  });
}
