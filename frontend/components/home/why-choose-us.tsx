'use client';

import { motion } from 'framer-motion';
import { Gem, Globe2, Leaf, ShieldCheck, Truck, Factory } from 'lucide-react';

const benefits = [
  {
    icon: Gem,
    title: 'Mine-direct purity',
    description:
      'Sourced directly from the Khewra Salt Range — no middlemen, no blending, no additives.',
  },
  {
    icon: ShieldCheck,
    title: 'Certified quality',
    description:
      'Food-grade certification, heavy-metal testing, and HACCP-compliant packaging on every order.',
  },
  {
    icon: Globe2,
    title: 'Worldwide export',
    description:
      'We ship to 40+ countries with full export documentation and FOB/CIF terms.',
  },
  {
    icon: Factory,
    title: 'Custom manufacturing',
    description:
      'Private label, custom sizes, and bespoke packaging — engineered to your brand.',
  },
  {
    icon: Leaf,
    title: 'Ethically sourced',
    description:
      'Fair wages, safe working conditions, and sustainable mining practices.',
  },
  {
    icon: Truck,
    title: 'Reliable logistics',
    description:
      'On-time delivery with tracked shipments and dedicated export coordinators.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-rose-500">
            Why choose us
          </p>
          <h2 className="mt-2 text-4xl font-semibold text-stone-900 sm:text-5xl">
            The HimalaSalt difference
          </h2>
          <p className="mt-3 text-stone-600">
            Six reasons distributors and brands trust us as their long-term
            Himalayan salt partner.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group rounded-2xl border border-rose-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-500 transition-colors group-hover:from-rose-500 group-hover:to-amber-400 group-hover:text-white">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-stone-900">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {b.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
