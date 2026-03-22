import { apiRequest } from "./client";

export type CardAuthorizeBody = {
  amount: string;
  merchant_name: string;
  idempotency_key: string;
};

export type CardCaptureBody = {
  authorization_id: string;
  from_account_id: string;
  idempotency_key: string;
};

export function authorizeCard(cardId: string, body: CardAuthorizeBody) {
  return apiRequest<Record<string, unknown>>({
    method: "POST",
    url: `/platform/cards/${cardId}/authorize`,
    data: body,
  });
}

export function captureCardAuthorization(cardId: string, body: CardCaptureBody) {
  return apiRequest<Record<string, unknown>>({
    method: "POST",
    url: `/platform/cards/${cardId}/capture`,
    data: body,
  });
}

export function reverseCardAuthorization(authorizationId: string) {
  return apiRequest<Record<string, unknown>>({
    method: "POST",
    url: `/platform/cards/authorizations/${authorizationId}/reverse`,
  });
}
