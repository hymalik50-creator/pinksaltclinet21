'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/lib/types';

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[] | string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  
  // Convert ProductImage[] to string[] if needed
  const imageUrls = images.map(img => 
    typeof img === 'string' ? img : img.displayUrl || img.imageUrl
  );
  
  // Add placeholder if no images
  const displayUrls = imageUrls.length > 0 ? imageUrls : ['/og-default.jpg'];
  
  if (!displayUrls.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        key={active}
        initial={{ opacity: 0.5, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-square overflow-hidden rounded-2xl border border-rose-100 bg-rose-50"
      >
        <Image
          src={displayUrls[active]}
          alt={`${name} — image ${active + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </motion.div>

      {displayUrls.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {displayUrls.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-square overflow-hidden rounded-lg border-2 transition-all',
                active === i
                  ? 'border-rose-500 ring-2 ring-rose-200'
                  : 'border-transparent hover:border-rose-200'
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
