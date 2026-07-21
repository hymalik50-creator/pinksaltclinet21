'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { inquirySchema, type InquiryFormValues } from '@/lib/validators';
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

interface InquiryFormProps {
  productName?: string;
  productId?: string;
  compact?: boolean;
}

export function InquiryForm({
  productName,
  productId,
  compact,
}: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      country: '',
      quantity: '',
      packagingRequirement: '',
      message: productName ? `I am interested in "${productName}". Please share pricing and availability.` : '',
      productName,
      productId,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InquiryFormValues) => publicApi.submitInquiry(data),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        <h3 className="text-lg font-semibold text-emerald-900">
          Inquiry received
        </h3>
        <p className="text-sm text-emerald-700">
          Thank you for your interest. Our export team will respond within one
          business day.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            form.reset();
          }}
        >
          Send another inquiry
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
        <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                  <Input placeholder="Your company" {...field} />
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
                  <Input type="email" placeholder="you@company.com" {...field} />
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
                  <Input placeholder="+1 555 000 0000" {...field} />
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
                  <Input placeholder="United States" {...field} />
                </FormControl>
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
                  <Input placeholder="e.g. 500 kg / 1000 pieces" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="packagingRequirement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Packaging requirement</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 25kg food-grade bags, custom retail boxes"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Tell us about your requirements, target market, and timeline."
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
          className="w-full bg-gradient-to-r from-rose-500 to-amber-400 text-white"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Inquiry'
          )}
        </Button>
      </form>
    </Form>
  );
}
