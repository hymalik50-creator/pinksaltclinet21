import { Hero } from '@/components/home/hero';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { InquiryCTA } from '@/components/home/inquiry-cta';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  path: '/',
  description:
    'Premium Himalayan pink salt products — lamps, edible salt, bath salts, and custom packaging. Ethically mined in the Khewra Salt Range and exported worldwide.',
});

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoryShowcase />
      <WhyChooseUs />
      <InquiryCTA />
    </>
  );
}
