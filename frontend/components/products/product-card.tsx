'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  // Handle both string and object image formats
  const getImageUrl = (image: any): string => {
    if (typeof image === 'string') return image;
    return image?.imageUrl || image?.displayUrl || '';
  };

  const imageUrl = product.images && product.images.length > 0 
    ? getImageUrl(product.images[0])
    : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-rose-50"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-16 w-16 text-rose-200" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {product.featured && (
            <Badge className="bg-rose-500 text-white">Featured</Badge>
          )}
          {product.availability === 'out-of-stock' && (
            <Badge variant="destructive">Out of stock</Badge>
          )}
          {product.availability === 'made-to-order' && (
            <Badge className="bg-amber-500 text-white">Made to order</Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-rose-500">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-stone-900">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors hover:text-rose-600"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-stone-600">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-500">
          <Package className="h-3.5 w-3.5" />
          <span className="line-clamp-1">
            {product.packaging[0] || 'Custom packaging'}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-500"
          >
            View Product
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/products/${product.slug}#inquiry`}
            className="inline-flex items-center justify-center rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
          >
            Inquiry
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
