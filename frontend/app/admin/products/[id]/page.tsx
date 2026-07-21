'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { products as mockProducts } from '@/lib/mock-data';
import { ProductForm } from '@/components/admin/product-form';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => adminApi.getProduct(id),
    retry: false,
  });

  const fallback = mockProducts.find((p) => p.id === id);
  const product = data || fallback;

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-rose-600"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to products
      </Link>
      <h1 className="mb-6 font-display text-3xl font-semibold text-stone-900">
        Edit product
      </h1>
      {isLoading && !product ? (
        <div className="flex items-center gap-2 text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading product...
        </div>
      ) : product ? (
        <ProductForm product={product} />
      ) : (
        <p className="text-sm text-red-600">Product not found.</p>
      )}
    </div>
  );
}
