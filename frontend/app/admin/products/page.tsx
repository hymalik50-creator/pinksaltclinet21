'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { products as mockProducts } from '@/lib/mock-data';
import type { Product, PaginatedProducts } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: () => adminApi.getProducts({ search }),
    retry: 1,
  });

  console.log('📦 Admin Products Page:', {
    isLoading,
    hasError: !!error,
    error: error?.message,
    hasData: !!data,
    dataKeys: data ? Object.keys(data) : [],
    rawData: data,
  });

  // Backend returns: { success, data: [...], pagination }
  const apiItems = data?.data || [];
  const fallback = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const items: Product[] =
    !isLoading && Array.isArray(apiItems) && apiItems.length > 0
      ? apiItems
      : fallback;

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteProduct(id);
      toast({ title: 'Product deleted' });
      qc.invalidateQueries({ queryKey: ['admin-products'] });
    } catch (e) {
      toast({
        title: 'Delete failed',
        description: e instanceof Error ? e.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Create, edit, publish, and feature your product catalogue.
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/products/new')}
          className="bg-gradient-to-r from-rose-500 to-amber-400 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New product
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">All products</CardTitle>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-9 pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wider text-stone-500">
                  <th className="pb-3 pr-4 font-medium">Product</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Featured</th>
                  <th className="pb-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((p) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-stone-50"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-rose-50 flex items-center justify-center">
                          {p.images && p.images.length > 0 && p.images[0] ? (
                            typeof p.images[0] === 'string' ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={p.images[0].imageUrl || p.images[0].displayUrl}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            )
                          ) : (
                            <span className="text-xs text-stone-400">No image</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-stone-900">
                            {p.name}
                          </p>
                          <p className="truncate text-xs text-stone-500">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-stone-600">{p.category}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                          p.published || p.isPublished
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {(p.published || p.isPublished) ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {(p.published || p.isPublished) ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {(p.featured || p.isFeatured) ? (
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Link href={`/admin/products/${p.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog
                          open={deletingId === p.id}
                          onOpenChange={(o) => setDeletingId(o ? p.id : null)}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete product?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete &ldquo;{p.name}&rdquo;.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(p.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
