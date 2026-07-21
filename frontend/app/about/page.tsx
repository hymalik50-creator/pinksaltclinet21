'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { site } from '@/lib/site';
import {
  Target,
  Eye,
  ShieldCheck,
  Factory,
  Package,
  Globe2,
  Award,
} from 'lucide-react';

const factoryImages = [
  { id: 4386370, alt: 'Salt lamp carving workshop' },
  { id: 4386371, alt: 'Salt block cutting line' },
  { id: 4386372, alt: 'Finished salt lamp inventory' },
  { id: 4386373, alt: 'Quality inspection station' },
];

const certifications = [
  'HACCP Food Safety',
  'ISO 22000:2018',
  'HALAL Certified',
  'KOSHER Certified',
  'FDA Registered Facility',
  'GMP Compliant',
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <p className="text-sm font-medium uppercase tracking-wider text-rose-500">
          About HimalaSalt
        </p>
        <h1 className="mt-2 text-5xl font-semibold text-stone-900">
          From the heart of the Khewra Salt Range
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          For over fifteen years, HimalaSalt has mined, milled, and exported
          premium Himalayan pink salt to distributors and brands across the
          globe. We combine traditional mining craftsmanship with modern
          quality systems to deliver consistently pure, food-grade salt.
        </p>
      </motion.div>

      {/* Mission / Vision / Quality */}
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Target,
            title: 'Our mission',
            body: 'To make the purest Himalayan salt accessible worldwide while supporting the communities that mine it.',
          },
          {
            icon: Eye,
            title: 'Our vision',
            body: 'To be the most trusted name in Himalayan salt exports — known for quality, ethics, and reliability.',
          },
          {
            icon: ShieldCheck,
            title: 'Quality promise',
            body: 'Every batch is tested for purity, heavy metals, and mineral content before it leaves our facility.',
          },
        ].map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-rose-100 bg-white p-7"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-500">
              <c.icon className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-stone-900">
              {c.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              {c.body}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Manufacturing & Packaging */}
      <section className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-semibold text-stone-900">
            Manufacturing & packaging
          </h2>
          <p className="mt-4 leading-relaxed text-stone-700">
            Our 40,000 sq ft facility combines hand-carving workshops with
            automated milling, sieving, and packaging lines. This lets us
            produce both artisanal salt lamps and high-volume food-grade salt
            under one roof.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              { icon: Factory, t: 'Hand-carving workshop', d: 'Skilled artisans shape each lamp and candleholder.' },
              { icon: Package, t: 'Automated packaging', d: 'Food-grade pouches, jars, and bulk bags with custom labels.' },
              { icon: ShieldCheck, t: 'In-house QA lab', d: 'Mineral, moisture, and heavy-metal testing on every batch.' },
            ].map((item) => (
              <li key={item.t} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">{item.t}</h3>
                  <p className="text-sm text-stone-600">{item.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {factoryImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={`https://images.pexels.com/photos/${img.id}/pexels-photo-${img.id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop`}
                alt={img.alt}
                fill
                sizes="50vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Countries served */}
      <section className="mt-20 rounded-2xl bg-stone-900 p-10 text-white">
        <div className="flex items-center gap-3">
          <Globe2 className="h-6 w-6 text-rose-400" />
          <h2 className="text-2xl font-semibold">Countries we serve</h2>
        </div>
        <p className="mt-3 max-w-2xl text-stone-300">
          We export to {site.countriesServed.length}+ countries across North
          America, Europe, the Middle East, and Asia-Pacific.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {site.countriesServed.map((c) => (
            <span
              key={c}
              className="rounded-full border border-stone-700 bg-stone-800 px-4 py-1.5 text-sm text-stone-200"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mt-16">
        <div className="flex items-center gap-3">
          <Award className="h-6 w-6 text-rose-500" />
          <h2 className="text-2xl font-semibold text-stone-900">
            Certifications
          </h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c) => (
            <div
              key={c}
              className="flex items-center gap-3 rounded-xl border border-rose-100 bg-white p-4"
            >
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span className="font-medium text-stone-900">{c}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
