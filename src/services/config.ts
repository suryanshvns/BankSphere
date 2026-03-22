import { resolvePublicApiBaseUrl } from "./public-api-base";

export function getApiBaseUrl() {
  return resolvePublicApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
}
