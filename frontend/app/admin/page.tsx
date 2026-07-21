'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  Inbox,
  Star,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Loader2,
  Mail,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  // Fetch stats from API
  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
    retry: 1,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch recent products
  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['admin-products', 'recent'],
    queryFn: () => adminApi.getProducts({ pageSize: 5 }),
    retry: 1,
  });

  // Fetch recent inquiries
  const { data: inquiriesData, isLoading: inquiriesLoading, error: inquiriesError } = useQuery({
    queryKey: ['admin-inquiries', 'recent'],
    queryFn: () => adminApi.getInquiries({ pageSize: 5 }),
    retry: 1,
  });

  // Fetch recent contacts
  const { data: contactsData, isLoading: contactsLoading, error: contactsError } = useQuery({
    queryKey: ['admin-contacts', 'recent'],
    queryFn: () => adminApi.getContacts({ pageSize: 5 }),
    retry: 1,
  });

  // Extract data from API responses
  // Backend returns: { success, message, data: {...} }
  const stats = statsData?.data || {
    totalProducts: 0,
    publishedProducts: 0,
    featuredProducts: 0,
    newInquiries: 0,
    totalInquiries: 0,
  };

  // Products: backend returns { data: [...] }
  const products = productsData?.data || [];
  
  // Inquiries: backend returns { data: { items: [...] } }
  const inquiries = inquiriesData?.data?.items || [];

  // Contacts: backend returns { data: { items: [...] } }
  const contacts = contactsData?.data?.items || [];

  console.log('📊 Dashboard Data:', {
    statsLoading,
    productsLoading,
    inquiriesLoading,
    contactsLoading,
    stats,
    productsCount: products.length,
    inquiriesCount: inquiries.length,
    contactsCount: contacts.length,
    rawStatsData: statsData,
    rawProductsData: productsData,
    rawInquiriesData: inquiriesData,
    rawContactsData: contactsData,
  });

  const cards = [
    {
      label: 'Total products',
      value: stats.totalProducts || 0,
      icon: Package,
      tint: 'from-rose-500 to-amber-400',
      link: '/admin/products',
    },
    {
      label: 'Published',
      value: stats.publishedProducts || 0,
      icon: CheckCircle2,
      tint: 'from-emerald-500 to-teal-400',
      link: '/admin/products',
    },
    {
      label: 'Featured',
      value: stats.featuredProducts || 0,
      icon: Star,
      tint: 'from-amber-400 to-orange-400',
      link: '/admin/products',
    },
    {
      label: 'New inquiries',
      value: stats.newInquiries || 0,
      icon: Inbox,
      tint: 'from-sky-500 to-indigo-400',
      link: '/admin/inquiries',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-stone-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Overview of your store and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link href={c.link}>
              <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-stone-500">
                    {c.label}
                  </CardTitle>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${c.tint} text-white`}
                  >
                    <c.icon className="h-4 w-4" />
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-stone-900">
                    {statsLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
                    ) : (
                      c.value
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent products</CardTitle>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700"
              >
                Manage <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="mx-auto h-12 w-12 text-stone-300" />
                <p className="mt-2 text-sm text-stone-500">No products yet</p>
                <Link
                  href="/admin/products/new"
                  className="mt-4 inline-block text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  Add your first product
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-stone-100">
                {products.slice(0, 5).map((p: any) => (
                  <li key={p.id} className="flex items-center gap-3 py-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-rose-50 flex items-center justify-center">
                      {p.images && p.images.length > 0 && p.images[0]?.imageUrl ? (
                        <img
                          src={p.images[0].imageUrl}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-rose-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-900">
                        {p.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        ${p.price} / {p.unit}
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      {p.isFeatured && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                          Featured
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          p.isPublished
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent Inquiries & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quick actions</CardTitle>
                <TrendingUp className="h-4 w-4 text-stone-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/admin/products/new"
                className="block rounded-lg border border-stone-200 px-4 py-3 text-sm font-medium text-stone-800 transition-colors hover:border-rose-300 hover:bg-rose-50"
              >
                + Add new product
              </Link>
              <Link
                href="/admin/inquiries"
                className="block rounded-lg border border-stone-200 px-4 py-3 text-sm font-medium text-stone-800 transition-colors hover:border-rose-300 hover:bg-rose-50"
              >
                View inquiries ({stats.newInquiries || 0} new)
              </Link>
              <Link
                href="/admin/contacts"
                className="block rounded-lg border border-stone-200 px-4 py-3 text-sm font-medium text-stone-800 transition-colors hover:border-rose-300 hover:bg-rose-50"
              >
                View contacts ({contacts.length} total)
              </Link>
              <Link
                href="/admin/products"
                className="block rounded-lg border border-stone-200 px-4 py-3 text-sm font-medium text-stone-800 transition-colors hover:border-rose-300 hover:bg-rose-50"
              >
                Manage products
              </Link>
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent inquiries</CardTitle>
                <Link
                  href="/admin/inquiries"
                  className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  View all <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {inquiriesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                </div>
              ) : inquiries.length === 0 ? (
                <div className="py-4 text-center">
                  <Mail className="mx-auto h-8 w-8 text-stone-300" />
                  <p className="mt-2 text-xs text-stone-500">No inquiries yet</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {inquiries.slice(0, 3).map((inquiry: any) => (
                    <li
                      key={inquiry.id}
                      className="rounded-lg border border-stone-100 p-3 hover:border-rose-200 hover:bg-rose-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-stone-900">
                            {inquiry.customerName}
                          </p>
                          <p className="truncate text-xs text-stone-500">
                            {inquiry.email}
                          </p>
                        </div>
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-medium text-rose-700 uppercase">
                          {inquiry.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recent Contacts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent contacts</CardTitle>
                <Link
                  href="/admin/contacts"
                  className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  View all <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {contactsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="py-4 text-center">
                  <Mail className="mx-auto h-8 w-8 text-stone-300" />
                  <p className="mt-2 text-xs text-stone-500">No contact messages yet</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {contacts.slice(0, 3).map((contact: any) => (
                    <li
                      key={contact.id}
                      className="rounded-lg border border-stone-100 p-3 hover:border-rose-200 hover:bg-rose-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-stone-900">
                            {contact.name}
                          </p>
                          <p className="truncate text-xs text-stone-500">
                            {contact.email}
                          </p>
                        </div>
                        <span className="text-xs text-stone-400">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
