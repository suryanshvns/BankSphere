import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiEnvelope } from "./types";
import { getApiBaseUrl } from "./config";
import { getAccessToken } from "./session";

/** POST without attaching JWT (public auth routes). */
export async function apiPublicPost<T>(path: string, data: unknown): Promise<T> {
  const res = await axios.post<ApiEnvelope<T>>(
    `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30_000,
    }
  );
  return res.data.data;
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type ApiErrorBody = {
  message?: string;
  detail?: string | unknown;
};

export function getErrorMessage(err: unknown): string {
  const ax = err as AxiosError<ApiErrorBody>;
  const data = ax.response?.data;
  if (data && typeof data === "object") {
    if (typeof data.message === "string") return data.message;
    if (typeof data.detail === "string") return data.detail;
  }
  if (ax.message) return ax.message;
  return "Something went wrong";
}

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.request<ApiEnvelope<T>>(config);
  return res.data.data;
}
