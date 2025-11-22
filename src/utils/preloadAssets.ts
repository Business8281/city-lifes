/**
 * Preload critical assets for better performance
 */

// Preload critical images
export const preloadCriticalImages = (imageUrls: string[]) => {
  if (typeof window === 'undefined') return;
  
  imageUrls.slice(0, 2).forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
};

// Preload fonts
export const preloadFonts = (fontUrls: string[]) => {
  if (typeof window === 'undefined') return;
  
  fontUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Prefetch route on hover
export const prefetchRoute = (routePath: string) => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = routePath;
  document.head.appendChild(link);
};

// Preconnect to critical origins
export const preconnectOrigins = (origins: string[]) => {
  if (typeof window === 'undefined') return;
  
  origins.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};
