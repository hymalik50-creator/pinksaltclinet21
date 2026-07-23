import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { publicApi } from '@/lib/api';
import { products as mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { buildMetadata, productJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { site } from '@/lib/site';
import { ProductGallery } from '@/components/products/product-gallery';
import { InquiryForm } from '@/components/forms/inquiry-form';
import { RelatedProducts } from '@/components/products/related-products';
import {
  ChevronRight,
  MapPin,
  Package,
  Boxes,
  Ship,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Params {
  params: { slug: string };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const data = (await publicApi.getProduct(slug)) as Product | null;
    if (data) return data;
  } catch {
    // fall through to mock
  }
  return mockProducts.find((p) => p.slug === slug) || null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) {
    return buildMetadata({
      title: 'Product not found',
      path: `/products/${params.slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.images[0],
    type: 'product',
  });
}

export default async function ProductDetailPage({ params }: Params) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const jsonLd = productJsonLd(product);
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: `${site.url}/` },
    { name: 'Products', url: `${site.url}/products` },
    { name: product.name, url: `${site.url}/products/${product.slug}` },
  ]);

  const whatsappText = encodeURIComponent(
    `Hello, I am interested in "${product.name}". Please share pricing and availability.`
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm text-stone-500">
        <Link href="/" className="hover:text-rose-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-rose-600">
          Products
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/products?category=${product.categoryId}`}
          className="hover:text-rose-600"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-stone-700">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-rose-100 text-rose-700">{product.category}</Badge>
            {product.featured && (
              <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
            )}
            <Badge
              variant="outline"
              className={
                product.availability === 'in-stock'
                  ? 'border-emerald-300 text-emerald-700'
                  : product.availability === 'made-to-order'
                  ? 'border-amber-300 text-amber-700'
                  : 'border-red-300 text-red-700'
              }
            >
              {product.availability.replace('-', ' ')}
            </Badge>
          </div>

          <h1 className="mt-4 text-4xl font-semibold text-stone-900 sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-stone-600">{product.shortDescription}</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info icon={MapPin} label="Origin" value={product.origin} />
            <Info icon={Package} label="Packaging" value={product.packaging.join(', ')} />
            <Info icon={Boxes} label="Minimum order" value={product.minimumOrderQuantity} />
            <Info icon={Ship} label="Export" value={product.exportInformation} />
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${site.whatsapp}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href="#inquiry"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              Send Inquiry
            </a>
          </div>
        </div>
      </div>

      {/* Description + specifications */}
      <div className="mt-16 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-stone-900">
            Product description
          </h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-stone-700">
            {product.description}
          </p>

          <h3 className="mt-10 text-xl font-semibold text-stone-900">Usage</h3>
          <p className="mt-3 leading-relaxed text-stone-700">{product.usage}</p>

          <h3 className="mt-10 text-xl font-semibold text-stone-900">
            Available sizes
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <span
                key={s}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-sm text-rose-700"
              >
                {s}
              </span>
            ))}
          </div>

          <h3 className="mt-10 text-xl font-semibold text-stone-900">
            Packaging options
          </h3>
          <ul className="mt-3 space-y-2">
            {product.packaging.map((p) => (
              <li key={p} className="flex items-center gap-2 text-stone-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-2xl border border-rose-100 bg-white p-6">
          <h3 className="text-lg font-semibold text-stone-900">Specifications</h3>
          <dl className="mt-4 divide-y divide-rose-50">
            {Object.entries(product.specifications).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-stone-500">{k}</dt>
                <dd className="text-right font-medium text-stone-900">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {/* Inquiry form */}
      <section id="inquiry" className="mt-20 scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-stone-900">
              Request a quote
            </h2>
            <p className="mt-3 text-stone-600">
              Fill out the form and our export team will respond within one
              business day with pricing, lead time, and shipping options.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-stone-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Bulk and retail pricing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Custom packaging and private label
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Worldwide shipping with documentation
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
            <InquiryForm productName={product.name} productId={product.id} />
          </div>
        </div>
      </section>

      <RelatedProducts product={product} />
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-rose-100 bg-white p-4">
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-stone-500">
        <Icon className="h-3.5 w-3.5 text-rose-500" />
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium text-stone-900">{value}</dd>
    </div>
  );
}
