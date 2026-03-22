#!/usr/bin/env bash
# BankSphere — NEW customer-app APIs only (hand to frontend).
#
# Login (existing): POST /api/v1/auth/login → data.access_token, data.refresh_token (new field).
#
# Export before running (pick what you need):
#   export ACCESS_TOKEN="..."      # required for most routes below
#   export REFRESH_TOKEN="..."     # for /auth/refresh and /auth/logout
#   export ACCOUNT_ID="..."        # for account + some tx examples
#   export ACCOUNT_ID_2="..."      # optional second account (recurring)
#   export LOAN_ID="..."
#   export SESSION_ID="..."
#   export FAILED_TX_ID="..."
#   export NOTIFICATION_ID="..."
#   export RECURRING_ID="..."
#   export BENEFICIARY_ACCOUNT_ID="..."  # another user's account (not self)
#   export BENEFICIARY_ID="..."
#   export CARD_ID="..."

set -o pipefail

BASE_URL="${BASE_URL:-http://localhost:8000}"
API="${BASE_URL}/api/v1"
H="Authorization: Bearer ${ACCESS_TOKEN:-}"

# --- Auth (new / changed) ---
# POST /auth/refresh  (public)
[[ -n "${REFRESH_TOKEN:-}" ]] && curl -s -X POST "${API}/auth/refresh" -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"${REFRESH_TOKEN}\"}" | python3 -m json.tool && echo

# POST /auth/logout (public)
[[ -n "${REFRESH_TOKEN:-}" ]] && curl -s -X POST "${API}/auth/logout" -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"${REFRESH_TOKEN}\"}" | python3 -m json.tool && echo

# POST /auth/forgot-password (public)
curl -s -X POST "${API}/auth/forgot-password" -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com"}' | python3 -m json.tool
echo

# POST /auth/reset-password (public)
curl -s -X POST "${API}/auth/reset-password" -H "Content-Type: application/json" \
  -d '{"token":"<RESET_TOKEN>","new_password":"NewLongPass123"}' | python3 -m json.tool
echo

# GET /auth/sessions
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s "${API}/auth/sessions" -H "$H" | python3 -m json.tool && echo

# DELETE /auth/sessions/{session_id}
[[ -n "${ACCESS_TOKEN:-}" && -n "${SESSION_ID:-}" ]] && curl -s -X DELETE "${API}/auth/sessions/${SESSION_ID}" -H "$H" | python3 -m json.tool && echo

# --- Profile & limits (new) ---
# PATCH /users/me
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s -X PATCH "${API}/users/me" -H "$H" -H "Content-Type: application/json" \
  -d '{"full_name":"Alice","phone":"+15550001","notify_email":true,"notify_push":false}' | python3 -m json.tool && echo

# POST /users/me/password
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s -X POST "${API}/users/me/password" -H "$H" -H "Content-Type: application/json" \
  -d '{"current_password":"<OLD>","new_password":"<NEW>"}' | python3 -m json.tool && echo

# GET /users/me/limits
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s "${API}/users/me/limits" -H "$H" | python3 -m json.tool && echo

# PATCH /users/me/limits
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s -X PATCH "${API}/users/me/limits" -H "$H" -H "Content-Type: application/json" \
  -d '{"daily_transfer_max":"5000.00","daily_atm_max":"1000.00"}' | python3 -m json.tool && echo

# --- Accounts (new) ---
# GET /accounts/{id}/balance
[[ -n "${ACCESS_TOKEN:-}" && -n "${ACCOUNT_ID:-}" ]] && curl -s "${API}/accounts/${ACCOUNT_ID}/balance" -H "$H" | python3 -m json.tool && echo

# PATCH /accounts/{id}  (nickname)
[[ -n "${ACCESS_TOKEN:-}" && -n "${ACCOUNT_ID:-}" ]] && curl -s -X PATCH "${API}/accounts/${ACCOUNT_ID}" -H "$H" -H "Content-Type: application/json" \
  -d '{"nickname":"Primary"}' | python3 -m json.tool && echo

# GET /accounts/{id}/statement?page=&page_size=&date_from=&date_to=
[[ -n "${ACCESS_TOKEN:-}" && -n "${ACCOUNT_ID:-}" ]] && curl -s "${API}/accounts/${ACCOUNT_ID}/statement?page=1&page_size=10" -H "$H" | python3 -m json.tool && echo

# GET /accounts/{id}/statement.csv
[[ -n "${ACCESS_TOKEN:-}" && -n "${ACCOUNT_ID:-}" ]] && curl -s "${API}/accounts/${ACCOUNT_ID}/statement.csv" -H "$H" | head -c 500 && echo && echo

# --- Transactions (new / extended) ---
# GET /transactions?account_id=&kind=&status=&date_from=&date_to=&page=&page_size=
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s "${API}/transactions?page=1&page_size=10" -H "$H" | python3 -m json.tool && echo

# POST /transactions/{id}/retry  body: { "idempotency_key": "..." }
[[ -n "${ACCESS_TOKEN:-}" && -n "${FAILED_TX_ID:-}" ]] && curl -s -X POST "${API}/transactions/${FAILED_TX_ID}/retry" -H "$H" -H "Content-Type: application/json" \
  -d '{"idempotency_key":"<NEW_UNIQUE_KEY>"}' | python3 -m json.tool && echo

# Optional field on deposit / withdraw / transfer: "client_reference"
[[ -n "${ACCESS_TOKEN:-}" && -n "${ACCOUNT_ID:-}" ]] && curl -s -X POST "${API}/transactions/deposit" -H "$H" -H "Content-Type: application/json" \
  -d "{\"account_id\":\"${ACCOUNT_ID}\",\"amount\":\"1.00\",\"idempotency_key\":\"<UNIQUE>\",\"client_reference\":\"REF-001\"}" | python3 -m json.tool && echo

# --- Loans (new) ---
# GET /loans/products
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s "${API}/loans/products" -H "$H" | python3 -m json.tool && echo

# GET /loans/{id}/schedule
[[ -n "${ACCESS_TOKEN:-}" && -n "${LOAN_ID:-}" ]] && curl -s "${API}/loans/${LOAN_ID}/schedule" -H "$H" | python3 -m json.tool && echo

# POST /loans/{id}/prepay  body: { "amount": "..." }
[[ -n "${ACCESS_TOKEN:-}" && -n "${LOAN_ID:-}" ]] && curl -s -X POST "${API}/loans/${LOAN_ID}/prepay" -H "$H" -H "Content-Type: application/json" \
  -d '{"amount":"50.00"}' | python3 -m json.tool && echo

# --- Notifications (new) ---
# PATCH /notifications/{id}/read
[[ -n "${ACCESS_TOKEN:-}" && -n "${NOTIFICATION_ID:-}" ]] && curl -s -X PATCH "${API}/notifications/${NOTIFICATION_ID}/read" -H "$H" | python3 -m json.tool && echo

# POST /notifications/read-all
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s -X POST "${API}/notifications/read-all" -H "$H" | python3 -m json.tool && echo

# --- Recurring payments (new) ---
# POST /recurring-payments
[[ -n "${ACCESS_TOKEN:-}" && -n "${ACCOUNT_ID:-}" && -n "${ACCOUNT_ID_2:-}" ]] && curl -s -X POST "${API}/recurring-payments" -H "$H" -H "Content-Type: application/json" \
  -d "{\"from_account_id\":\"${ACCOUNT_ID}\",\"to_account_id\":\"${ACCOUNT_ID_2}\",\"amount\":\"10.00\",\"frequency\":\"MONTHLY\",\"next_run_at\":\"2026-04-01T00:00:00Z\"}" | python3 -m json.tool && echo

# GET /recurring-payments
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s "${API}/recurring-payments" -H "$H" | python3 -m json.tool && echo

# PATCH /recurring-payments/{id}/active  body: { "active": true|false }
[[ -n "${ACCESS_TOKEN:-}" && -n "${RECURRING_ID:-}" ]] && curl -s -X PATCH "${API}/recurring-payments/${RECURRING_ID}/active" -H "$H" -H "Content-Type: application/json" \
  -d '{"active":false}' | python3 -m json.tool && echo

# --- Beneficiaries (new) ---
# POST /beneficiaries
[[ -n "${ACCESS_TOKEN:-}" && -n "${BENEFICIARY_ACCOUNT_ID:-}" ]] && curl -s -X POST "${API}/beneficiaries" -H "$H" -H "Content-Type: application/json" \
  -d "{\"display_name\":\"Payee\",\"beneficiary_account_id\":\"${BENEFICIARY_ACCOUNT_ID}\"}" | python3 -m json.tool && echo

# GET /beneficiaries
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s "${API}/beneficiaries" -H "$H" | python3 -m json.tool && echo

# DELETE /beneficiaries/{id}
[[ -n "${ACCESS_TOKEN:-}" && -n "${BENEFICIARY_ID:-}" ]] && curl -s -X DELETE "${API}/beneficiaries/${BENEFICIARY_ID}" -H "$H" | python3 -m json.tool && echo

# --- Cards (new) ---
# POST /cards
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s -X POST "${API}/cards" -H "$H" -H "Content-Type: application/json" \
  -d '{"label":"Debit","last4":"4242"}' | python3 -m json.tool && echo

# GET /cards
[[ -n "${ACCESS_TOKEN:-}" ]] && curl -s "${API}/cards" -H "$H" | python3 -m json.tool && echo

# PATCH /cards/{id}/freeze  body: { "is_frozen": true|false }
[[ -n "${ACCESS_TOKEN:-}" && -n "${CARD_ID:-}" ]] && curl -s -X PATCH "${API}/cards/${CARD_ID}/freeze" -H "$H" -H "Content-Type: application/json" \
  -d '{"is_frozen":true}' | python3 -m json.tool && echo

# POST /cards/{id}/cancel
[[ -n "${ACCESS_TOKEN:-}" && -n "${CARD_ID:-}" ]] && curl -s -X POST "${API}/cards/${CARD_ID}/cancel" -H "$H" | python3 -m json.tool && echo
