/** Used when `NEXT_PUBLIC_API_BASE_URL` is unset (e.g. deploy preview). */
const DEFAULT_API_BASE_URL = "https://banksphere-backend.onrender.com/api/v1";

export function getApiBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const base = raw && raw.length > 0 ? raw : DEFAULT_API_BASE_URL;
  return base.replace(/\/$/, "");
}
