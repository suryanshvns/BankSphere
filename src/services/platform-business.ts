import { apiRequest } from "./client";

export type BusinessProfileBody = {
  company_name: string;
  registration_number: string;
  country: string;
};

export function submitBusinessProfile(body: BusinessProfileBody) {
  return apiRequest<Record<string, unknown>>({
    method: "POST",
    url: "/platform/business/profile",
    data: body,
  });
}
