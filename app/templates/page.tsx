import { redirect } from 'next/navigation';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Headshot Templates & Styles',
  description: 'Browse 21 professional AI headshot templates and styles. Corporate, Lawyer, Realtor, Executive, and more — starting at $29 for 40+ HD headshots.',
}

export default function TemplatesPage() {
  redirect('/headshots');
}
