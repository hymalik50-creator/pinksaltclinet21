'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Globe,
  Package,
  Trash2,
  Loader2,
  Inbox,
  Search,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { Inquiry } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';

const STATUSES = ['new', 'read', 'responded', 'archived'] as const;
type Status = (typeof STATUSES)[number];

export default function AdminInquiriesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-inquiries', search],
    queryFn: () => adminApi.getInquiries({ search }),
    retry: 1,
  });

  // Backend returns: { success, message, data: { items: [...] }, pagination }
  const inquiries: Inquiry[] = data?.data?.items || [];
  
  console.log('📋 Inquiries Page Data:', {
    isLoading,
    error: error?.message,
    hasData: !!data,
    inquiriesCount: inquiries.length,
    rawData: data,
  });

  const selected = inquiries.find((i) => i.id === selectedId) || inquiries[0];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      adminApi.updateInquiryStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-inquiries'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Status updated successfully' });
    },
    onError: (e) => {
      console.error('❌ Status update error:', e);
      toast({
        title: 'Failed to update status',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteInquiry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-inquiries'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      setSelectedId(null);
      toast({ title: 'Inquiry deleted successfully' });
    },
    onError: (e) => {
      console.error('❌ Delete inquiry error:', e);
      toast({
        title: 'Failed to delete inquiry',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });

  const statusColors: Record<Status, string> = {
    new: 'bg-rose-100 text-rose-700',
    read: 'bg-sky-100 text-sky-700',
    responded: 'bg-emerald-100 text-emerald-700',
    archived: 'bg-stone-100 text-stone-600',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-stone-900">
          Inquiries
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Review and respond to product and bulk order inquiries.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">All inquiries</CardTitle>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">
                {inquiries.filter((i) => i.status === 'new').length} new
              </span>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inquiries..."
                className="h-9 pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-stone-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-stone-500">
                <Inbox className="h-8 w-8 text-stone-300" />
                No inquiries yet.
              </div>
            ) : (
              <ul className="space-y-1">
                {inquiries.map((i) => (
                  <li key={i.id}>
                    <button
                      onClick={() => setSelectedId(i.id)}
                      className={cn(
                        'w-full rounded-lg px-3 py-3 text-left transition-colors',
                        (selected?.id === i.id)
                          ? 'bg-rose-50'
                          : 'hover:bg-stone-100'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-stone-900">
                          {i.customerName || i.name}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
                            statusColors[i.status as Status]
                          )}
                        >
                          {i.status}
                        </span>
                      </div>
                      <p className="truncate text-xs text-stone-500">
                        {i.productName || 'General inquiry'}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-400">
                        {new Date(i.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{selected.customerName || selected.name}</CardTitle>
                      <p className="mt-1 text-sm text-stone-500">
                        {new Date(selected.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={selected.status}
                        onValueChange={(v) =>
                          statusMutation.mutate({
                            id: selected.id,
                            status: v as Status,
                          })
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete inquiry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the inquiry from{" "}
                              {selected.customerName || selected.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(selected.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <DetailRow icon={Mail} label="Email" value={selected.email} />
                    <DetailRow icon={Phone} label="Phone" value={selected.phone} />
                    <DetailRow icon={Globe} label="Country" value={selected.country} />
                    <DetailRow icon={Package} label="Quantity" value={selected.quantity} />
                  </div>

                  {selected.companyName || selected.company && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                        Company
                      </p>
                      <p className="mt-1 text-sm text-stone-900">{selected.companyName || selected.company}</p>
                    </div>
                  )}

                  {selected.productName && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                        Product
                      </p>
                      <p className="mt-1 text-sm text-stone-900">
                        {selected.productName}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                      Message
                    </p>
                    <p className="mt-2 whitespace-pre-line rounded-lg bg-stone-50 p-4 text-sm text-stone-800">
                      {selected.message}
                    </p>
                  </div>

                  <div className="flex gap-2 border-t border-stone-100 pt-4">
                    <a href={`mailto:${selected.email}`}>
                      <Button className="bg-gradient-to-r from-rose-500 to-amber-400 text-white">
                        Reply via email
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center text-sm text-stone-500">
                <Inbox className="h-10 w-10 text-stone-300" />
                Select an inquiry to view details.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-stone-100 p-3">
      <Icon className="h-4 w-4 text-rose-500" />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-stone-500">{label}</p>
        <p className="truncate text-sm font-medium text-stone-900">{value}</p>
      </div>
    </div>
  );
}
