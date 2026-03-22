import { apiRequest } from "./client";

export type OutboundPaymentRail = "ACH_SIM" | "WIRE_SIM" | "RTP_SIM";

export type OutboundCounterparty = {
  name: string;
  account_last4?: string;
};

export type CreateOutboundPaymentBody = {
  from_account_id: string;
  amount: string;
  rail: OutboundPaymentRail;
  idempotency_key: string;
  counterparty: OutboundCounterparty;
  reference?: string;
};

export type OutboundPayment = {
  id?: string;
  status?: string;
  amount?: string;
  rail?: string;
  reference?: string;
  [key: string]: unknown;
};

export function createOutboundPayment(body: CreateOutboundPaymentBody) {
  return apiRequest<OutboundPayment>({
    method: "POST",
    url: "/platform/payments/outbound",
    data: body,
  });
}

export function listOutboundPayments() {
  return apiRequest<OutboundPayment[]>({
    method: "GET",
    url: "/platform/payments/outbound",
  });
}
