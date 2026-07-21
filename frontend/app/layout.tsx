import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { QueryProvider } from '@/components/providers/query-provider';
import { AdminProvider } from '@/components/providers/admin-provider';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { site } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: 'website',
    images: ['/og-default.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
        <QueryProvider>
          <AdminProvider>
            <SmoothScroll>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </SmoothScroll>
          </AdminProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
