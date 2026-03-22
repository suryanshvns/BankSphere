import { apiRequest } from "./client";

export type SupportCaseCreateBody = {
  subject: string;
  body: string;
  priority?: number;
};

export type SupportCase = {
  id?: string;
  subject?: string;
  body?: string;
  priority?: number;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
};

export function createSupportCase(body: SupportCaseCreateBody) {
  return apiRequest<SupportCase>({
    method: "POST",
    url: "/platform/support/cases",
    data: body,
  });
}

export function listSupportCases() {
  return apiRequest<SupportCase[]>({
    method: "GET",
    url: "/platform/support/cases",
  });
}
