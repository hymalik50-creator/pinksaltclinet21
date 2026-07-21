import type { Metadata } from 'next';
import { site } from './site';

interface BuildMetadataArgs {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description = site.description,
  path = '/',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  noIndex,
}: BuildMetadataArgs = {}): Metadata {
  const url = `${site.url}${path}`;
  const ogImage = image || '/og-default.jpg';
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      type: type === 'product' ? 'website' : type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  images: string[];
  slug: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.images,
    url: `${site.url}/products/${product.slug}`,
    brand: { '@type': 'Brand', name: site.name },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
