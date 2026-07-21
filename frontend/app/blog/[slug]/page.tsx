import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { site } from '@/lib/site';
import { blogPosts } from '@/lib/mock-data';
import { ChevronRight } from 'lucide-react';

interface Params {
  params: { slug: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) {
    return buildMetadata({
      title: 'Article not found',
      path: `/blog/${params.slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: 'article',
    publishedTime: post.publishedAt,
  });
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: Params) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: `${site.url}/` },
    { name: 'Blog', url: `${site.url}/blog` },
    { name: post.title, url: `${site.url}/blog/${post.slug}` },
  ]);

  return (
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-16 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <nav className="flex items-center gap-1 text-sm text-stone-500">
        <Link href="/" className="hover:text-rose-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/blog" className="hover:text-rose-600">
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-stone-700">{post.title}</span>
      </nav>

      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600"
          >
            {t}
          </span>
        ))}
      </div>

      <h1 className="mt-4 text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-stone-500">
        {new Date(post.publishedAt).toLocaleDateString()} · {post.author}
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-rose-50">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-8 prose prose-stone max-w-none">
        <p className="text-lg leading-relaxed text-stone-700">{post.excerpt}</p>
        <p className="mt-4 leading-relaxed text-stone-700">{post.content}</p>
      </div>

      <div className="mt-12 border-t border-rose-100 pt-6">
        <Link
          href="/blog"
          className="text-sm font-medium text-rose-600 hover:text-rose-700"
        >
          ← Back to all articles
        </Link>
      </div>
    </article>
  );
}
