'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api';
import type { Category } from '@/lib/types';

export function CategoryShowcase() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-categories'],
    queryFn: () => publicApi.getCategories(),
    retry: 1,
  });

  // Backend returns: { success, data: [...] }
  const categories: Category[] = data?.data || [];
  
  // Filter only published categories
  const publishedCategories = categories.filter(cat => cat.isPublished !== false);

  if (isLoading) {
    return (
      <section className="relative bg-stone-100/60 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          </div>
        </div>
      </section>
    );
  }

  if (publishedCategories.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-stone-100/60 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-rose-500">
            Browse by category
          </p>
          <h2 className="mt-2 text-4xl font-semibold text-stone-900 sm:text-5xl">
            Everything salt, beautifully crafted
          </h2>
          <p className="mt-3 text-stone-600">
            From edible crystals to ambient lamps, explore our full range of
            Himalayan salt products.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {publishedCategories.map((cat, i) => {
            const imageUrl = cat.image || cat.imageUrl || '/images/placeholder-category.jpg';
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-2xl font-semibold">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="mt-1 text-sm text-stone-200 line-clamp-2">
                            {cat.description}
                          </p>
                        )}
                      </div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-rose-500">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
