'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ProductForm } from '@/components/admin/product-form';

export default function NewProductPage() {
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
        New product
      </h1>
      <ProductForm />
    </div>
  );
}
