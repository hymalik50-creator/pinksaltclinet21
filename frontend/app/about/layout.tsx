import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  path: '/about',
  description:
    'Learn about HimalaSalt — our mission, vision, quality standards, manufacturing, and the countries we serve.',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
