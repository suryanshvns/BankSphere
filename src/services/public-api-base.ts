/** Python BankSphere API — must be absolute; see `getApiBaseUrl()`. */
export const DEFAULT_PUBLIC_API_BASE_URL =
  "https://banksphere-backend.onrender.com/api/v1";

/**
 * Normalizes `NEXT_PUBLIC_API_BASE_URL` for browser and server.
 * - Empty or relative `/api/...` → Render (avoids calling the current Vercel host).
 * - Accidental admin UI origin → Render.
 */
export function resolvePublicApiBaseUrl(input: string | undefined): string {
  const raw = input?.trim() ?? "";
  const fallback = DEFAULT_PUBLIC_API_BASE_URL;
  if (!raw) return fallback;
  if (raw.startsWith("/")) return fallback;
  if (raw.includes("bank-sphere-admin.vercel.app")) return fallback;
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return fallback;
    const path = u.pathname.replace(/\/$/, "");
    return path ? `${u.origin}${path}` : u.origin;
  } catch {
    return fallback;
  }
}
