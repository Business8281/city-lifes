import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  priority?: boolean;
  width?: number;
  height?: number;
  quality?: number;
  sizes?: string;
  rounded?: boolean;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

// Helper to generate Supabase Storage transformation URLs
const getOptimizedUrl = (src: string, width?: number, quality: number = 70): string => {
  if (!src) return '';
  
  // If already a data URL, return as-is
  if (src.startsWith('data:')) {
    return src;
  }
  
  // For Supabase Storage URLs, return as-is (transformations can be added later if needed)
  // Supabase automatically serves images, no need to modify URLs
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // If it's a relative path, return as-is
  return src;
};

// Generate srcset for responsive images - disabled for now to simplify
const generateSrcSet = (src: string, quality: number): string => {
  // Return empty string to avoid srcset issues
  return '';
};

export const OptimizedImage = ({
  src,
  alt,
  className,
  aspectRatio = 'square',
  priority = false,
  width,
  height,
  quality = 70,
  sizes = '100vw',
  rounded = false,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    setError(true);
    onError?.(e);
  };

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  }[aspectRatio];

  const optimizedSrc = getOptimizedUrl(src, width, quality);
  const srcSet = generateSrcSet(src, quality);

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-muted',
        aspectClass,
        rounded && 'rounded-lg',
        className
      )}
      style={width && height ? { aspectRatio: `${width}/${height}` } : undefined}
    >
      {/* Shimmer loading placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted-foreground/10 to-muted">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}
      
      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      {!error && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          draggable={false}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
};
