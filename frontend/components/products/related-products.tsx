'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api';
import { products as mockProducts } from '@/lib/mock-data';
import type { Product, PaginatedProducts } from '@/lib/types';
import { ProductCard } from '@/components/products/product-card';

export function RelatedProducts({ product }: { product: Product }) {
  const { data, isLoading } = useQuery<PaginatedProducts>({
    queryKey: ['products', { category: product.categoryId, limit: 4 }],
    queryFn: () =>
      publicApi.getProducts({ category: product.categoryId, limit: 5 }),
    retry: false,
  });

  const fallback = mockProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);
  const apiItems = data?.items;
  const items: Product[] =
    !isLoading && Array.isArray(apiItems) && apiItems.length > 0
      ? apiItems.filter((p) => p.id !== product.id).slice(0, 4)
      : fallback;

  if (items.length === 0) return null;

  return (
    <section className="mt-24">
      <h2 className="text-3xl font-semibold text-stone-900">
        Related products
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
