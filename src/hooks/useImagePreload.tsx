import { useEffect } from 'react';
import { preloadImage } from '@/utils/imageOptimization';

/**
 * Preload critical images for faster page rendering
 */
export const useImagePreload = (images: string[]) => {
  useEffect(() => {
    const preloadPromises = images
      .filter(Boolean)
      .slice(0, 3) // Only preload first 3 images
      .map((src) => preloadImage(src).catch(console.error));

    Promise.all(preloadPromises);
  }, [images]);
};

/**
 * Prefetch images on hover for instant navigation
 */
export const usePrefetchOnHover = () => {
  const prefetchImage = (src: string) => {
    if (!src) return;
    preloadImage(src).catch(console.error);
  };

  return { prefetchImage };
};
