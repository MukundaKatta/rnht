const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_SECRET environment variables");
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function createPayPalOrder(opts: {
  amount: number;
  description: string;
  donationId: string;
  returnUrl: string;
  cancelUrl: string;
}): Promise<{ id: string; approvalUrl: string }> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: opts.amount.toFixed(2),
          },
          description: opts.description,
          custom_id: opts.donationId,
        },
      ],
      application_context: {
        return_url: opts.returnUrl,
        cancel_url: opts.cancelUrl,
        brand_name: "Rudra Narayana Hindu Temple",
        user_action: "PAY_NOW",
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal create order failed: ${res.status} ${err}`);
  }

  const order = await res.json();
  const approvalUrl = order.links.find(
    (l: { rel: string; href: string }) => l.rel === "approve"
  )?.href;

  if (!approvalUrl) {
    throw new Error("PayPal order missing approval URL");
  }

  return { id: order.id, approvalUrl };
}

export async function capturePayPalOrder(orderId: string): Promise<{
  status: string;
  donationId: string | undefined;
}> {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  const donationId = data.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id
    || data.purchase_units?.[0]?.custom_id;

  return { status: data.status, donationId };
}
