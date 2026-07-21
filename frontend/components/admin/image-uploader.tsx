'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const { toast } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((f) => adminApi.uploadImage(f))
      );
      const urls = uploaded
        .map((r) => r?.url)
        .filter((u): u is string => Boolean(u));
      onChange([...images, ...urls]);
      toast({ title: `${urls.length} image(s) uploaded` });
    } catch (e) {
      toast({
        title: 'Upload failed',
        description: e instanceof Error ? e.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    onChange([...images, u]);
    setUrlInput('');
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/40 px-6 py-10 text-center transition-colors hover:border-rose-400 hover:bg-rose-50"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
        </div>
        <p className="text-sm font-medium text-stone-800">
          {uploading ? 'Uploading...' : 'Drop images here or click to upload'}
        </p>
        <p className="text-xs text-stone-500">PNG, JPG, WEBP up to 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste an image URL..."
        />
        <Button type="button" variant="outline" onClick={addUrl}>
          <ImagePlus className="mr-2 h-4 w-4" />
          Add URL
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={cn(
                'group relative aspect-square overflow-hidden rounded-lg border border-stone-200',
                i === 0 && 'ring-2 ring-rose-400 ring-offset-1'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Product image ${i + 1}`}
                className="h-full w-full object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-medium text-white">
                  Main
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
