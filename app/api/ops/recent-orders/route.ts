import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/supabase";
import { verifyOpsRadarToken } from "@/lib/ops-notify";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token =
    req.headers.get("x-ops-token") ??
    req.nextUrl.searchParams.get("token");

  if (!verifyOpsRadarToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = req.nextUrl.searchParams.get("since");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const supabase = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let query = supabase
    .from("orders")
    .select("id, tier, amount_cents, currency, status, created_at, creem_checkout_id")
    .eq("status", "paid")
    .order("id", { ascending: false })
    .limit(20);

  if (since) {
    query = query.gt("created_at", since);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const orders = (data ?? []).slice().reverse();
  return NextResponse.json({
    orders,
    serverTime: new Date().toISOString(),
  });
}
