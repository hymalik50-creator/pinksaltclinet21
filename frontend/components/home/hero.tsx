'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

const SaltCrystal = dynamic(
  () => import('@/components/three/salt-crystal').then((m) => m.SaltCrystal),
  { ssr: false, loading: () => null }
);
const SaltParticles = dynamic(
  () => import('@/components/three/salt-particles').then((m) => m.SaltParticles),
  { ssr: false, loading: () => null }
);

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-gradient-to-b from-rose-50 via-stone-50 to-stone-50">
      <div className="absolute inset-0 hero-radial" aria-hidden />
      <div className="absolute inset-0 opacity-70" aria-hidden>
        <SaltParticles count={180} />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pt-28 pb-16 md:grid-cols-2 md:px-8 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="z-10"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-rose-600 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ethically mined in the Khewra Salt Range
          </motion.span>

          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] text-stone-900 sm:text-6xl lg:text-7xl">
            Pure Himalayan
            <span className="block bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">
              Pink Salt
            </span>
            from mine to market.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
            We mine, mill, and export premium Himalayan pink salt — lamps,
            edible crystals, bath salts, and custom packaging for distributors
            and brands worldwide.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-transform hover:scale-105"
            >
              Explore Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-6 py-3 text-sm font-semibold text-stone-800 backdrop-blur transition-colors hover:border-rose-300 hover:text-rose-600"
            >
              <MessageCircle className="h-4 w-4" />
              Send Inquiry
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-rose-100 pt-6 text-sm">
            {[
              ['15+', 'Years of export'],
              ['40+', 'Countries served'],
              ['100%', 'Food-grade quality'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl font-semibold text-rose-500">
                  {n}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[420px] w-full md:h-[560px]"
        >
          <div className="absolute inset-0 rounded-full bg-rose-200/40 blur-3xl" />
          <SaltCrystal />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-50 to-transparent" />
    </section>
  );
}
