'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 hero-radial" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center"
      >
        <p className="font-display text-[8rem] font-semibold leading-none text-rose-200 sm:text-[12rem]">
          404
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl">
          This page dissolved like salt in water
        </h1>
        <p className="mx-auto mt-3 max-w-md text-stone-600">
          The page you are looking for could not be found. It may have been
          moved, removed, or never existed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition-colors hover:border-rose-300 hover:text-rose-600"
          >
            <Search className="h-4 w-4" />
            Browse products
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
