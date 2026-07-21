import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildMetadata } from '@/lib/seo';
import { blogPosts } from '@/lib/mock-data';

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  path: '/blog',
  description:
    'Articles, guides, and stories about Himalayan pink salt — from mining to wellness and culinary uses.',
});

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-rose-500">
          HimalaSalt Journal
        </p>
        <h1 className="mt-2 text-5xl font-semibold text-stone-900">
          Stories from the salt range
        </h1>
        <p className="mt-3 text-lg text-stone-600">
          Guides, science, and stories about Himalayan pink salt — its origins,
          uses, and the people who mine it.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-rose-50">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-stone-900 group-hover:text-rose-600">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-stone-600">
                {post.excerpt}
              </p>
              <p className="mt-4 text-xs text-stone-400">
                {new Date(post.publishedAt).toLocaleDateString()} · {post.author}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
