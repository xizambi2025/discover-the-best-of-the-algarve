function env(name) {
  return process.env[name]?.trim() ?? "";
}

function apiRoot() {
  return env("WISE_SANDBOX") === "1" ? "https://api.wise-sandbox.com" : "https://api.wise.com";
}

function openPayBase() {
  const raw = env("WISE_OPEN_PAY_LINK") || env("PAYMENT_URL");
  if (!raw) return null;
  const trimmed = raw.split("?")[0].trim().replace(/\/$/, "");
  if (!/^https:\/\/wise\.com\/pay\//i.test(trimmed)) return null;
  return trimmed;
}

function money(amount) {
  return (Math.round(amount * 100) / 100).toFixed(2);
}

/** Wise documents open-link query params; the Platform API has no create-payment-link endpoint. */
export async function createWisePaymentLink({ amount, currency, description }) {
  const base = openPayBase();
  if (!base) return { ok: false, code: "wise-config" };
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, code: "amount" };

  const token = env("WISE_API_TOKEN");
  if (token) {
    const me = await fetch(`${apiRoot()}/v1/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!me.ok) return { ok: false, code: "wise-auth" };
  }

  const payCurrency = (currency || env("WISE_PAY_CURRENCY") || "EUR").toUpperCase();
  const params = new URLSearchParams({
    amount: money(amount),
    currency: payCurrency,
    description: description.slice(0, 200),
  });
  return { ok: true, link: `${base}?${params.toString()}` };
}
