import { apiRequest } from './client';
import type { Account } from './types';

export type CreateAccountBody = {
  type: string;
  currency: string;
};

export function createAccount(body: CreateAccountBody) {
  return apiRequest<Account>({ method: 'POST', url: '/accounts', data: body });
}

export function listAccounts() {
  return apiRequest<Account[]>({ method: 'GET', url: '/accounts' });
}

export function getAccountById(accountId: string) {
  return apiRequest<Account>({
    method: 'GET',
    url: `/accounts/${accountId}`,
  });
}
