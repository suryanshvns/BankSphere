/** BankSphere API — single backend base (no env fallbacks). */
const API_BASE_URL = "https://banksphere-backend.onrender.com/api/v1";

export function getApiBaseUrl() {
  return API_BASE_URL;
}
