'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { bulkOrderSchema, type BulkOrderFormValues } from '@/lib/validators';
import { publicApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { categories as mockCategories } from '@/lib/mock-data';

export function BulkOrderForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<BulkOrderFormValues>({
    resolver: zodResolver(bulkOrderSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      country: '',
      productCategory: '',
      quantity: '',
      packaging: '',
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: BulkOrderFormValues) =>
      publicApi.submitInquiry({ ...data, subject: 'Bulk order request' }),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        <h3 className="text-lg font-semibold text-emerald-900">
          Bulk order request received
        </h3>
        <p className="text-sm text-emerald-700">
          Our export team will prepare a custom quote and reach out within one
          business day.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            form.reset();
          }}
        >
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product category *</FormLabel>
                <FormControl>
                  <Input
                    list="bulk-categories"
                    placeholder="e.g. Salt Lamps"
                    {...field}
                  />
                </FormControl>
                <datalist id="bulk-categories">
                  {mockCategories.map((c) => (
                    <option key={c.slug} value={c.name} />
                  ))}
                </datalist>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 5 metric tons" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="packaging"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Packaging</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 25kg bags" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details *</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Tell us about your project, target market, and timeline."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isError && (
          <p className="text-sm text-destructive">
            {mutation.error?.message || 'Something went wrong. Please try again.'}
          </p>
        )}

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-stone-900 text-white hover:bg-stone-800"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Request bulk quote'
          )}
        </Button>
      </form>
    </Form>
  );
}
