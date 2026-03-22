import { useMutation, useQuery } from "@tanstack/react-query";
import { getDataExport, requestDataExport } from "@/services/platform-privacy";

export function useRequestDataExportMutation() {
  return useMutation({
    mutationFn: requestDataExport,
  });
}

export function useDataExportStatusQuery(exportId: string | null) {
  return useQuery({
    queryKey: ["platform", "privacy", "data-export", exportId],
    queryFn: () => getDataExport(exportId as string),
    enabled: Boolean(exportId?.trim()),
  });
}
