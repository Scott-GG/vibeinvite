import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CREEM_API = "https://test-api.creem.io/v1/checkouts";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, eventId } = body as {
      type: "pro_event" | "subscription";
      eventId?: string;
    };

    const isPro = type === "pro_event";
    const productId = isPro
      ? process.env.CREEM_PRO_PRODUCT_ID
      : process.env.CREEM_UNLIMITED_PRODUCT_ID;

    if (!productId) {
      console.error("[creem checkout] Missing product ID for type:", type);
      return NextResponse.json(
        { error: "Server configuration error — missing product ID" },
        { status: 500 },
      );
    }

    const host = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

    const checkoutBody: Record<string, unknown> = {
      product_id: productId,
      units: 1,
      referenceId: user.id,
      customer: { email: user.email },
      metadata: { type, ...(eventId ? { eventId } : {}) },
      success_url: isPro
        ? `${host}/dashboard/events/${eventId}?upgrade=success`
        : `${host}/dashboard/billing?subscribe=success`,
    };

    const res = await fetch(CREEM_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CREEM_API_KEY!,
      },
      body: JSON.stringify(checkoutBody),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[creem checkout] API error:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Failed to create checkout", details: JSON.stringify(data) },
        { status: res.status },
      );
    }

    return NextResponse.json({ url: data.checkout_url });
  } catch (error) {
    console.error("[creem checkout] Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
