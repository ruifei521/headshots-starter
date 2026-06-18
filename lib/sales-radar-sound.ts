/** Synthesized cash-register "cha-ching" — no external audio file needed. */
export function playPaymentChime(audioContext?: AudioContext): void {
  if (typeof window === "undefined") return;

  const ctx = audioContext ?? new AudioContext();
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.45, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
  master.connect(ctx.destination);

  const coin = ctx.createOscillator();
  coin.type = "square";
  coin.frequency.setValueAtTime(880, now);
  coin.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
  const coinGain = ctx.createGain();
  coinGain.gain.setValueAtTime(0.25, now);
  coinGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  coin.connect(coinGain);
  coinGain.connect(master);
  coin.start(now);
  coin.stop(now + 0.2);

  const register = ctx.createOscillator();
  register.type = "triangle";
  register.frequency.setValueAtTime(520, now + 0.05);
  register.frequency.exponentialRampToValueAtTime(1040, now + 0.22);
  const registerGain = ctx.createGain();
  registerGain.gain.setValueAtTime(0.001, now + 0.05);
  registerGain.gain.linearRampToValueAtTime(0.35, now + 0.08);
  registerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
  register.connect(registerGain);
  registerGain.connect(master);
  register.start(now + 0.05);
  register.stop(now + 0.6);

  const shimmer = ctx.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.setValueAtTime(1320, now + 0.12);
  shimmer.frequency.exponentialRampToValueAtTime(1980, now + 0.35);
  const shimmerGain = ctx.createGain();
  shimmerGain.gain.setValueAtTime(0.001, now + 0.12);
  shimmerGain.gain.linearRampToValueAtTime(0.12, now + 0.16);
  shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(master);
  shimmer.start(now + 0.12);
  shimmer.stop(now + 0.75);

  if (!audioContext) {
    window.setTimeout(() => {
      void ctx.close();
    }, 900);
  }
}
