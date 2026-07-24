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
    const product = (await publicApi.getProduct(slug)) as Product | null;
    if (product && product.id) return product;
  } catch (error) {
    console.error('Error fetching product:', error);
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
  
  // Extract image URL from ProductImage or use as string
  let imageUrl: string | undefined;
  if (product.images && product.images.length > 0) {
    imageUrl = typeof product.images[0] === 'string' 
      ? product.images[0] 
      : product.images[0]?.displayUrl || product.images[0]?.imageUrl;
  }
  
  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/products/${product.slug}`,
    image: imageUrl,
    type: 'product',
  });
}

export default async function ProductDetailPage({ params }: Params) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  // Log the product data to see what we're actually getting from the API
  console.log('🔍 Product data received:', {
    name: product.name,
    slug: product.slug,
    hasImages: !!product.images,
    imagesLength: product.images?.length,
    hasDescription: !!product.description,
    hasShortDescription: !!product.shortDescription,
    hasFullDescription: !!product.fullDescription,
    keys: Object.keys(product)
  });

  // Normalize product data - handle different field names from API
  const normalizedProduct = {
    ...product,
    description: product.description || product.fullDescription || product.shortDescription || 'No description available',
    shortDescription: product.shortDescription || product.description || 'Premium Himalayan Salt Product',
    images: product.images || [],
    packaging: product.packaging || ['Contact us for packaging options'],
    sizes: product.sizes || ['Contact us for available sizes'],
    specifications: product.specifications || { 'Contact': 'For detailed specifications' },
    origin: product.origin || 'Pakistan',
    usage: product.usage || 'Contact us for usage information',
    minimumOrderQuantity: product.minimumOrderQuantity || 'Contact us for MOQ',
    category: product.category || 'Himalayan Salt Products',
  };

  const jsonLd = productJsonLd(normalizedProduct);
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: `${site.url}/` },
    { name: 'Products', url: `${site.url}/products` },
    { name: normalizedProduct.name, url: `${site.url}/products/${normalizedProduct.slug}` },
  ]);

  const whatsappText = encodeURIComponent(
    `Hello, I am interested in "${normalizedProduct.name}". Please share pricing and availability.`
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
          href={`/products?category=${normalizedProduct.categoryId}`}
          className="hover:text-rose-600"
        >
          {normalizedProduct.category || 'Category'}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-stone-700">{normalizedProduct.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <ProductGallery images={normalizedProduct.images || []} name={normalizedProduct.name} />

        <div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-rose-100 text-rose-700">{normalizedProduct.category || 'Product'}</Badge>
            {normalizedProduct.featured && (
              <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
            )}
            {normalizedProduct.availability && typeof normalizedProduct.availability === 'string' && (
              <Badge
                variant="outline"
                className={
                  normalizedProduct.availability === 'in-stock'
                    ? 'border-emerald-300 text-emerald-700'
                    : normalizedProduct.availability === 'made-to-order'
                    ? 'border-amber-300 text-amber-700'
                    : 'border-red-300 text-red-700'
                }
              >
                {normalizedProduct.availability.replace('-', ' ')}
              </Badge>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-semibold text-stone-900 sm:text-5xl">
            {normalizedProduct.name}
          </h1>
          <p className="mt-3 text-lg text-stone-600">{normalizedProduct.shortDescription}</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info icon={MapPin} label="Origin" value={normalizedProduct.origin} />
            <Info icon={Package} label="Packaging" value={normalizedProduct.packaging?.join(', ')} />
            <Info icon={Boxes} label="Minimum order" value={normalizedProduct.minimumOrderQuantity} />
            <Info icon={Ship} label="Export" value={normalizedProduct.exportInformation} />
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
            {normalizedProduct.description || normalizedProduct.fullDescription || normalizedProduct.shortDescription}
          </p>

          {normalizedProduct.usage && (
            <>
              <h3 className="mt-10 text-xl font-semibold text-stone-900">Usage</h3>
              <p className="mt-3 leading-relaxed text-stone-700">{normalizedProduct.usage}</p>
            </>
          )}

          {normalizedProduct.sizes && normalizedProduct.sizes.length > 0 && (
            <>
              <h3 className="mt-10 text-xl font-semibold text-stone-900">
                Available sizes
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(normalizedProduct.sizes || []).map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-sm text-rose-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}

          {normalizedProduct.packaging && normalizedProduct.packaging.length > 0 && (
            <>
              <h3 className="mt-10 text-xl font-semibold text-stone-900">
                Packaging options
              </h3>
              <ul className="mt-3 space-y-2">
                {(normalizedProduct.packaging || []).map((p) => (
                  <li key={p} className="flex items-center gap-2 text-stone-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {Object.keys(normalizedProduct.specifications || {}).length > 0 && (
          <aside className="rounded-2xl border border-rose-100 bg-white p-6">
            <h3 className="text-lg font-semibold text-stone-900">Specifications</h3>
            <dl className="mt-4 divide-y divide-rose-50">
              {Object.entries(normalizedProduct.specifications || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-stone-500">{k}</dt>
                  <dd className="text-right font-medium text-stone-900">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
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
            <InquiryForm productName={normalizedProduct.name} productId={normalizedProduct.id} />
          </div>
        </div>
      </section>

      <RelatedProducts product={normalizedProduct} />
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
  value?: string;
}) {
  if (!value) return null;
  
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
