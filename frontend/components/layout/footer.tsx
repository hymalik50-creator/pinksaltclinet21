'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { site, navLinks } from '@/lib/site';
import { categories as mockCategories } from '@/lib/mock-data';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-rose-100 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-amber-300 text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2l4 7h-3v13h-2V9H8l4-7z" />
              </svg>
            </span>
            <span className="text-lg font-semibold text-white">
              Himala<span className="text-rose-400">Salt</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-stone-400">
            {site.description}
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { icon: Facebook, href: site.social.facebook, label: 'Facebook' },
              { icon: Instagram, href: site.social.instagram, label: 'Instagram' },
              { icon: Linkedin, href: site.social.linkedin, label: 'LinkedIn' },
              { icon: Twitter, href: site.social.twitter, label: 'Twitter' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-800 text-stone-300 transition-colors hover:bg-rose-500 hover:text-white"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-stone-400 transition-colors hover:text-rose-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                className="text-stone-400 transition-colors hover:text-rose-400"
              >
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Categories
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {mockCategories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="text-stone-400 transition-colors hover:text-rose-400"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Get in touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-stone-400">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-rose-400" />
              <span>{site.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-rose-400" />
              <a href={`tel:${site.phone}`} className="hover:text-rose-400">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-rose-400" />
              <a href={`mailto:${site.email}`} className="hover:text-rose-400">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-stone-500 md:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-rose-400">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-rose-400">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-rose-400">
              Sitemap
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
