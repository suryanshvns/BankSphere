export type ApiEnvelope<T> = {
  data: T;
  message?: string;
  error?: string;
};

export type UserMe = {
  id?: string;
  email: string;
  full_name: string;
  role?: string;
  kyc_status?: string;
  kyc_reference_id?: string | null;
  phone?: string | null;
  notify_email?: boolean;
  notify_push?: boolean;
};

export type Account = {
  id: string;
  type: string;
  currency: string;
  balance?: string;
  status?: string;
  created_at?: string;
  nickname?: string | null;
};

export type Transaction = {
  id: string;
  account_id?: string;
  type?: string;
  amount?: string;
  status?: string;
  description?: string | null;
  created_at?: string;
  counterparty_account_id?: string | null;
};

export type Loan = {
  id: string;
  principal?: string;
  annual_rate_pct?: string;
  tenure_months?: number;
  purpose?: string;
  status?: string;
  monthly_emi?: string;
  created_at?: string;
};

export type NotificationItem = {
  id: string;
  title?: string;
  message?: string;
  read?: boolean;
  created_at?: string;
};

export type AuthTokens = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
};

export type HealthPayload = {
  status?: string;
  [key: string]: unknown;
};
