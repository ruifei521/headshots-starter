"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTierInfo } from "@/lib/tiers";
import { playPaymentChime } from "@/lib/sales-radar-sound";

type OrderRow = {
  id: number;
  tier: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
  creem_checkout_id: string | null;
};

const POLL_MS = 3000;

function formatMoney(amountCents: number, currency: string): string {
  const amount = amountCents / 100;
  if (currency.toUpperCase() === "USD") return `$${amount.toFixed(2)}`;
  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
}

export function SalesRadar({ token }: { token: string }) {
  const [soundReady, setSoundReady] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [lastPoll, setLastPoll] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalToday, setTotalToday] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const bootstrappedRef = useRef(false);

  const enableSound = useCallback(async () => {
    const ctx = audioCtxRef.current ?? new AudioContext();
    audioCtxRef.current = ctx;
    if (ctx.state === "suspended") await ctx.resume();
    playPaymentChime(ctx);
    setSoundReady(true);
  }, []);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/ops/recent-orders", {
        headers: { "x-ops-token": token },
        cache: "no-store",
      });
      if (!res.ok) {
        setError(res.status === 401 ? "Invalid token" : "Failed to load orders");
        return;
      }
      setError(null);
      const body = (await res.json()) as { orders: OrderRow[]; serverTime: string };
      setLastPoll(body.serverTime);

      const incoming = body.orders;
      if (!bootstrappedRef.current) {
        for (const o of incoming) seenIdsRef.current.add(o.id);
        bootstrappedRef.current = true;
        setOrders(incoming.slice().reverse());
        const today = new Date().toDateString();
        setTotalToday(
          incoming
            .filter((o) => new Date(o.created_at).toDateString() === today)
            .reduce((sum, o) => sum + o.amount_cents, 0)
        );
        return;
      }

      const fresh = incoming.filter((o) => !seenIdsRef.current.has(o.id));
      if (fresh.length > 0) {
        for (const o of fresh) seenIdsRef.current.add(o.id);
        setOrders((prev) => [...prev, ...fresh]);
        setTotalToday((prev) => prev + fresh.reduce((s, o) => s + o.amount_cents, 0));
        if (soundReady && audioCtxRef.current) {
          for (let i = 0; i < fresh.length; i++) {
            window.setTimeout(() => playPaymentChime(audioCtxRef.current!), i * 450);
          }
        }
      }
    } catch {
      setError("Network error");
    }
  }, [token, soundReady]);

  useEffect(() => {
    void poll();
    const id = window.setInterval(() => void poll(), POLL_MS);
    return () => window.clearInterval(id);
  }, [poll]);

  useEffect(() => {
    if (!soundReady || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    void navigator.wakeLock.request("screen").then((sentinel) => {
      lock = sentinel;
    });
    return () => {
      void lock?.release();
    };
  }, [soundReady]);

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col gap-6 p-6">
      <header className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          Sales Radar
        </p>
        <h1 className="text-3xl font-bold text-white">SnapProHead</h1>
        <p className="text-sm text-zinc-400">
          Keep this page open — new payments play a cha-ching sound.
        </p>
      </header>

      {!soundReady ? (
        <button
          type="button"
          onClick={() => void enableSound()}
          className="rounded-xl bg-emerald-500 px-6 py-4 text-lg font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
        >
          🔊 Tap to enable payment sound
        </button>
      ) : (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-300">
          Listening every {POLL_MS / 1000}s · sound on
        </div>
      )}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
        <p className="text-sm text-zinc-400">Today (loaded orders)</p>
        <p className="text-4xl font-bold text-white">
          ${(totalToday / 100).toFixed(2)}
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <section className="flex-1 space-y-3">
        <h2 className="text-sm font-medium text-zinc-400">Recent payments</h2>
        {orders.length === 0 ? (
          <p className="text-zinc-500">Waiting for the first payment…</p>
        ) : (
          <ul className="space-y-2">
            {[...orders].reverse().map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">
                    {getTierInfo(order.tier).name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="text-lg font-semibold text-emerald-400">
                  {formatMoney(order.amount_cents, order.currency)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lastPoll && (
        <p className="text-center text-xs text-zinc-600">
          Last check: {new Date(lastPoll).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
