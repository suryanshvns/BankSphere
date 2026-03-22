import { apiRequest } from './client';
import type { UserMe } from './types';

export function getCurrentUser() {
  return apiRequest<UserMe>({ method: 'GET', url: '/users/me' });
}

export type KycSubmitBody = {
  reference_id: string;
};

export function submitKycReference(body: KycSubmitBody) {
  return apiRequest<UserMe>({
    method: 'POST',
    url: '/users/me/kyc/submit',
    data: body,
  });
}
