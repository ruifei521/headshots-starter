import { redirect } from 'next/navigation';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Headshot Packs & Styles',
  description: 'Browse premium AI headshot packs with 12 professional styles. Each pack includes 40+ HD headshots starting at $29 — delivered in ~30 minutes.',
}

export default function PacksRedirect() {
  redirect('/');
}
