'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Trash2, Plus } from 'lucide-react';
import { productSchema, type ProductFormValues } from '@/lib/validators';
import { adminApi } from '@/lib/api';
import { categories as mockCategories } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImageUploader } from '@/components/admin/image-uploader';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          ...product,
          specifications: product.specifications || {},
          packaging: product.packaging || [],
          sizes: product.sizes || [],
          images: product.images || [],
        }
      : {
          name: '',
          slug: '',
          category: '',
          shortDescription: '',
          description: '',
          images: [],
          featured: false,
          published: true,
          origin: 'Khewra Salt Range, Punjab, Pakistan',
          usage: '',
          packaging: [],
          sizes: [],
          availability: 'in-stock',
          minimumOrderQuantity: '',
          exportInformation: '',
          specifications: {},
        },
  });

  const packaging = form.watch('packaging') || [];
  const sizes = form.watch('sizes') || [];

  const addPackaging = () => form.setValue('packaging', [...packaging, '']);
  const removePackaging = (i: number) =>
    form.setValue('packaging', packaging.filter((_, idx) => idx !== i));
  const updatePackaging = (i: number, v: string) => {
    const next = [...packaging];
    next[i] = v;
    form.setValue('packaging', next);
  };

  const addSize = () => form.setValue('sizes', [...sizes, '']);
  const removeSize = (i: number) =>
    form.setValue('sizes', sizes.filter((_, idx) => idx !== i));
  const updateSize = (i: number, v: string) => {
    const next = [...sizes];
    next[i] = v;
    form.setValue('sizes', next);
  };

  const mutation = useMutation({
    mutationFn: (data: ProductFormValues) => {
      if (product) return adminApi.updateProduct(product.id, data);
      return adminApi.createProduct(data);
    },
    onSuccess: () => {
      toast({ title: product ? 'Product updated' : 'Product created' });
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      router.push('/admin/products');
    },
    onError: (e) => {
      toast({
        title: 'Save failed',
        description: e instanceof Error ? e.message : undefined,
        variant: 'destructive',
      });
    },
  });

  const addSpec = () => {
    if (!specKey.trim()) return;
    const current = form.getValues('specifications');
    form.setValue('specifications', { ...current, [specKey]: specVal });
    setSpecKey('');
    setSpecVal('');
  };

  const removeSpec = (k: string) => {
    const current = form.getValues('specifications');
    const next = { ...current };
    delete next[k];
    form.setValue('specifications', next);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. natural-salt-lamp-medium" {...field} />
                </FormControl>
                <FormDescription>
                  URL-friendly identifier. Lowercase, hyphens only.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockCategories.map((c) => (
                      <SelectItem key={c.slug} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="in-stock">In stock</SelectItem>
                    <SelectItem value="made-to-order">Made to order</SelectItem>
                    <SelectItem value="out-of-stock">Out of stock</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short description *</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="One-line summary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full description *</FormLabel>
              <FormControl>
                <Textarea rows={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Images */}
        <div>
          <FormLabel className="mb-2 block">Product images *</FormLabel>
          <ImageUploader
            images={form.watch('images')}
            onChange={(imgs) => form.setValue('images', imgs)}
          />
          {form.formState.errors.images && (
            <p className="mt-1 text-sm font-medium text-destructive">
              {form.formState.errors.images.message}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minimumOrderQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum order quantity *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 100 pieces / 500 kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="usage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usage *</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exportInformation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Export information</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Packaging */}
        <div>
          <FormLabel className="mb-2 block">Packaging options</FormLabel>
          <div className="space-y-2">
            {packaging.map((val, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={val}
                  onChange={(e) => updatePackaging(i, e.target.value)}
                  placeholder="e.g. 25kg food-grade bag"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removePackaging(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={addPackaging}
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Add packaging option
          </Button>
        </div>

        {/* Sizes */}
        <div>
          <FormLabel className="mb-2 block">Available sizes</FormLabel>
          <div className="space-y-2">
            {sizes.map((val, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={val}
                  onChange={(e) => updateSize(i, e.target.value)}
                  placeholder="e.g. 2-3 kg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeSize(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={addSize}
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Add size
          </Button>
        </div>

        {/* Specifications */}
        <div>
          <FormLabel className="mb-2 block">Specifications</FormLabel>
          <div className="flex gap-2">
            <Input
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
              placeholder="Key (e.g. Weight)"
            />
            <Input
              value={specVal}
              onChange={(e) => setSpecVal(e.target.value)}
              placeholder="Value (e.g. 2-3 kg)"
            />
            <Button type="button" variant="outline" onClick={addSpec}>
              Add
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            {Object.entries(form.watch('specifications') || {}).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm"
              >
                <span className="font-medium text-stone-700">{k}</span>
                <span className="text-stone-600">{v}</span>
                <button
                  type="button"
                  onClick={() => removeSpec(k)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-stone-200 p-4">
                <div>
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>
                    Show this product in featured sections.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-stone-200 p-4">
                <div>
                  <FormLabel>Published</FormLabel>
                  <FormDescription>
                    Unpublished products are hidden from the public site.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-gradient-to-r from-rose-500 to-amber-400 text-white"
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {product ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
