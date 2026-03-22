export function formatCurrency(
  value: string | number | undefined,
  currency = "USD"
) {
  const n =
    typeof value === "string"
      ? parseFloat(value)
      : typeof value === "number"
        ? value
        : 0;
  if (Number.isNaN(n)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(0);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(n);
}

export function parseDecimalInput(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  const n = parseFloat(t);
  if (Number.isNaN(n)) return "";
  return n.toFixed(2);
}
