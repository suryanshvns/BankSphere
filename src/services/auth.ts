import { apiClient } from './client';
import type { ApiEnvelope, AuthTokens } from './types';

export type SignupBody = {
  email: string;
  password: string;
  full_name: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export async function signup(body: SignupBody): Promise<AuthTokens> {
  const { data } = await apiClient.post<ApiEnvelope<AuthTokens>>(
    '/auth/signup',
    body
  );
  return data.data;
}

export async function login(body: LoginBody): Promise<AuthTokens> {
  const { data } = await apiClient.post<ApiEnvelope<AuthTokens>>(
    '/auth/login',
    body
  );
  return data.data;
}
