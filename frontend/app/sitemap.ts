import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { products, categories, blogPosts } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/products', '/about', '/contact', '/blog'].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })
  );

  const productRoutes = products.map((p) => ({
    url: `${site.url}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${site.url}/products?category=${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((b) => ({
    url: `${site.url}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
