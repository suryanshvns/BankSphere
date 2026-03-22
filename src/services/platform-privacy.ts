import { apiRequest } from "./client";

export type DataExportRequest = {
  id?: string;
  export_id?: string;
  status?: string;
  [key: string]: unknown;
};

export function requestDataExport() {
  return apiRequest<DataExportRequest>({
    method: "POST",
    url: "/platform/privacy/data-export",
  });
}

export function getDataExport(exportUuid: string) {
  return apiRequest<Record<string, unknown>>({
    method: "GET",
    url: `/platform/privacy/data-export/${exportUuid}`,
  });
}
