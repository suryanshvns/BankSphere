import { apiClient } from './client';
import type { ApiEnvelope, HealthPayload } from './types';

export async function getHealth(): Promise<HealthPayload> {
  const { data } = await apiClient.get<ApiEnvelope<HealthPayload>>('/health');
  return data.data;
}
