'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { products as mockProducts } from '@/lib/mock-data';
import type { Product, PaginatedProducts } from '@/lib/types';
import { ProductCard } from '@/components/products/product-card';

export function FeaturedProducts() {
  const { data, isLoading } = useQuery<PaginatedProducts>({
    queryKey: ['products', { featured: true, limit: 4 }],
    queryFn: () => publicApi.getProducts({ featured: true, limit: 4 }),
    retry: false,
  });

  // Fall back to mock data when API is unavailable (frontend-only mode)
  const fallback = mockProducts.filter((p) => p.featured).slice(0, 4);
  const apiItems = data?.items;
  const items: Product[] =
    !isLoading && Array.isArray(apiItems) && apiItems.length > 0
      ? apiItems
      : fallback;

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-rose-500">
              Handpicked for you
            </p>
            <h2 className="mt-2 text-4xl font-semibold text-stone-900 sm:text-5xl">
              Featured products
            </h2>
            <p className="mt-3 max-w-xl text-stone-600">
              A curated selection of our best-selling Himalayan salt products,
              ready for bulk export and private label.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
          >
            View all products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
