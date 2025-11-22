import { useEffect } from 'react';

/**
 * Preload critical images for faster page rendering
 */
export const useImagePreload = (images: string[]) => {
  useEffect(() => {
    const preloadPromises = images
      .filter(Boolean)
      .slice(0, 2) // Only preload first 2 critical images
      .map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Don't block on errors
          img.src = src;
        });
      });

    Promise.all(preloadPromises);
  }, [images]);
};

/**
 * Prefetch images on hover for instant navigation
 */
export const usePrefetchOnHover = () => {
  const prefetchImage = (src: string) => {
    if (!src || typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  };

  return { prefetchImage };
};
