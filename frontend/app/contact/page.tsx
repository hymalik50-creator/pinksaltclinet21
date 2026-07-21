import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import { ContactForm } from '@/components/forms/contact-form';
import { BulkOrderForm } from '@/components/forms/bulk-order-form';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  path: '/contact',
  description:
    'Get in touch with HimalaSalt for product inquiries, bulk orders, and export partnerships.',
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-rose-500">
          Contact us
        </p>
        <h1 className="mt-2 text-5xl font-semibold text-stone-900">
          Let's talk salt
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          Whether you need a single sample or a full container load, our export
          team is ready to help. Reach out and we will respond within one
          business day.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Contact info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-rose-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">
              Company information
            </h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-rose-500" />
                <span className="text-stone-700">{site.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-rose-500" />
                <a href={`tel:${site.phone}`} className="text-stone-700 hover:text-rose-600">
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-rose-500" />
                <a href={`mailto:${site.email}`} className="text-stone-700 hover:text-rose-600">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-rose-500" />
                <span className="text-stone-700">{site.businessHours}</span>
              </li>
            </ul>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-rose-100">
            <iframe
              title="HimalaSalt location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=73.0%2C32.6%2C73.5%2C33.0&layer=mapnik&marker=32.9%2C73.25"
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-rose-100 bg-white p-6">
            <h2 className="text-xl font-semibold text-stone-900">
              Send a message
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              For general inquiries, partnership requests, or product questions.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk order form */}
      <section className="mt-12 rounded-2xl bg-stone-900 p-8 text-white lg:p-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold">Bulk order request</h2>
            <p className="mt-3 text-stone-300">
              For orders above 1 metric ton or custom manufacturing, submit a
              bulk order request and we will prepare a tailored quote with
              pricing, lead time, and shipping options.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-stone-300">
              <li>• FOB Karachi / CIF destination pricing</li>
              <li>• Private label and custom packaging</li>
              <li>• Full export documentation</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 text-stone-900">
            <BulkOrderForm />
          </div>
        </div>
      </section>
    </div>
  );
}
