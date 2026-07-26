'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  PackageSearch,
  Loader2,
} from 'lucide-react';
import { publicApi } from '@/lib/api';
import { products as mockProducts, categories as mockCategories } from '@/lib/mock-data';
import type { Product, PaginatedProducts } from '@/lib/types';
import { ProductCard } from '@/components/products/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const AVAILABILITY = [
  { value: 'all', label: 'All availability' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'made-to-order', label: 'Made to order' },
  { value: 'out-of-stock', label: 'Out of stock' },
];

const PACKAGING_TYPES = [
  'Individual gift box',
  'Carton of 12',
  'Custom retail packaging',
  '25kg food-grade bag',
  '500g glass jar',
  '1 ton super sack',
];

function ProductsContent() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCategory = params.get('category') || 'all';
  const initialSearch = params.get('q') || '';
  const initialSort = (params.get('sort') as string) || 'latest';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState('all');
  const [packaging, setPackaging] = useState<string[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search + sync URL
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams();
      if (search) next.set('q', search);
      if (category !== 'all') next.set('category', category);
      if (sort !== 'latest') next.set('sort', sort);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 350);
    return () => clearTimeout(t);
  }, [search, category, sort, pathname, router]);

  const { data, isLoading, error } = useQuery<PaginatedProducts>({
    queryKey: ['products', { search, category, availability, packaging, featuredOnly, sort }],
    queryFn: () =>
      publicApi.getProducts({
        search,
        category: category !== 'all' ? category : undefined,
        availability: availability !== 'all' ? availability : undefined,
        packaging: packaging.length ? packaging.join(',') : undefined,
        featured: featuredOnly || undefined,
        sort,
      }),
    retry: 1,
  });

  // Frontend-only fallback: filter mock data when API is unavailable
  const fallbackFiltered = useMemo(() => {
    let list = [...mockProducts].filter((p) => p.published);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.name, p.category || '', p.shortDescription, p.description, p.usage, ...p.packaging]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    }
    if (category !== 'all') {
      list = list.filter((p) => p.categoryId === category || (p.category && p.category.toLowerCase().replace(/\s+/g, '-') === category));
    }
    if (availability !== 'all') {
      list = list.filter((p) => p.availability && typeof p.availability === 'string' && p.availability === availability);
    }
    if (packaging.length) {
      list = list.filter((p) => packaging.some((pk) => p.packaging.includes(pk)));
    }
    if (featuredOnly) list = list.filter((p) => p.featured);

    switch (sort) {
      case 'alphabetical':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
      case 'category':
        list.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      default:
        list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return list;
  }, [search, category, availability, packaging, featuredOnly, sort]);

  console.log('🌐 Public Products Page:', {
    isLoading,
    hasError: !!error,
    error: error?.message,
    hasData: !!data,
    dataStructure: data,
    itemsCount: data?.items?.length || data?.data?.length || 0,
  });

  // Backend returns: { success, data: [...], pagination } OR { items: [...] }
  // Extract the products array from the response
  const apiItems = (data as any)?.data || (data as any)?.items || [];
  const items: Product[] =
    !isLoading && Array.isArray(apiItems) && apiItems.length > 0
      ? apiItems
      : fallbackFiltered;

  const activeFilterCount =
    (category !== 'all' ? 1 : 0) +
    (availability !== 'all' ? 1 : 0) +
    packaging.length +
    (featuredOnly ? 1 : 0);

  const resetFilters = () => {
    setCategory('all');
    setAvailability('all');
    setPackaging([]);
    setFeaturedOnly(false);
    setSearch('');
  };

  const togglePackaging = (pk: string) =>
    setPackaging((prev) =>
      prev.includes(pk) ? prev.filter((p) => p !== pk) : [...prev, pk]
    );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <p className="text-sm font-medium uppercase tracking-wider text-rose-500">
          Product catalogue
        </p>
        <h1 className="mt-2 text-5xl font-semibold text-stone-900">
          Explore our salt collection
        </h1>
        <p className="mt-3 text-stone-600">
          Search across {mockProducts.length}+ products by name, category,
          packaging, or intended use. Filter and sort to find exactly what you
          need.
        </p>
      </motion.div>

      {/* Search + sort row */}
      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, packaging, or usage..."
            className="h-12 rounded-full border-rose-200 bg-white pl-11 pr-11"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-stone-400 hover:bg-stone-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters((s) => !s)}
            className="h-12 rounded-full border-rose-200 px-5"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2 bg-rose-500 text-white">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-12 w-44 rounded-full border-rose-200 bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6 grid gap-6 rounded-2xl border border-rose-100 bg-white p-6 md:grid-cols-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Category
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <FilterChip
                    active={category === 'all'}
                    onClick={() => setCategory('all')}
                  >
                    All
                  </FilterChip>
                  {mockCategories.map((c) => (
                    <FilterChip
                      key={c.slug}
                      active={category === c.slug}
                      onClick={() => setCategory(c.slug)}
                    >
                      {c.name}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Availability
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {AVAILABILITY.map((a) => (
                    <FilterChip
                      key={a.value}
                      active={availability === a.value}
                      onClick={() => setAvailability(a.value)}
                    >
                      {a.label}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Packaging
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PACKAGING_TYPES.map((pk) => (
                    <FilterChip
                      key={pk}
                      active={packaging.includes(pk)}
                      onClick={() => togglePackaging(pk)}
                    >
                      {pk}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Featured
                </h3>
                <div className="mt-3">
                  <FilterChip
                    active={featuredOnly}
                    onClick={() => setFeaturedOnly((f) => !f)}
                  >
                    Featured only
                  </FilterChip>
                </div>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    onClick={resetFilters}
                    className="mt-4 h-9 px-3 text-rose-600 hover:bg-rose-50"
                  >
                    Reset all filters
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500">Active filters:</span>
          {category !== 'all' && (
            <ActiveChip
              label={mockCategories.find((c) => c.slug === category)?.name || category}
              onRemove={() => setCategory('all')}
            />
          )}
          {availability !== 'all' && (
            <ActiveChip
              label={AVAILABILITY.find((a) => a.value === availability)?.label || ''}
              onRemove={() => setAvailability('all')}
            />
          )}
          {packaging.map((pk) => (
            <ActiveChip key={pk} label={pk} onRemove={() => togglePackaging(pk)} />
          ))}
          {featuredOnly && (
            <ActiveChip label="Featured only" onRemove={() => setFeaturedOnly(false)} />
          )}
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-rose-600 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results */}
      <div className="mt-8 flex items-center justify-between text-sm text-stone-500">
        <p>
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading products...
            </span>
          ) : (
            <>
              Showing <span className="font-semibold text-stone-900">{items.length}</span>{' '}
              {items.length === 1 ? 'product' : 'products'}
            </>
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[420px] animate-pulse rounded-2xl border border-rose-100 bg-rose-50/50"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-rose-500 bg-rose-500 text-white'
          : 'border-stone-200 bg-white text-stone-700 hover:border-rose-300 hover:text-rose-600'
      )}
    >
      {children}
    </button>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
      {label}
      <button
        onClick={onRemove}
        className="rounded-full p-0.5 hover:bg-rose-200"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-400">
        <PackageSearch className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold text-stone-900">No products found</h3>
      <p className="max-w-md text-sm text-stone-600">
        We could not find any products matching your search and filters. Try
        adjusting your query or clearing filters.
      </p>
      <Button
        onClick={onReset}
        className="mt-2 rounded-full bg-rose-500 text-white hover:bg-rose-600"
      >
        Clear all filters
      </Button>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-stone-500">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
