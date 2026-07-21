'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { site } from '@/lib/site';

export function InquiryCTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-rose-400 to-amber-300 px-8 py-16 text-center text-white shadow-2xl md:px-16"
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-amber-200/40 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="font-display text-4xl font-semibold sm:text-5xl">
              Ready to source premium Himalayan salt?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-rose-50">
              Tell us about your requirements and our export team will prepare a
              custom quote within one business day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-rose-600 shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" />
                Send an inquiry
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
