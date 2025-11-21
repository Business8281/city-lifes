/**
 * Image Optimization Utilities
 * Handles image compression, WebP conversion, and upload optimization
 */

export interface CompressedImage {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

export interface ImageSizeVariant {
  name: 'thumbnail' | 'medium' | 'large';
  maxWidth: number;
  quality: number;
}

const IMAGE_VARIANTS: ImageSizeVariant[] = [
  { name: 'thumbnail', maxWidth: 300, quality: 70 },
  { name: 'medium', maxWidth: 900, quality: 75 },
  { name: 'large', maxWidth: 1600, quality: 80 },
];

/**
 * Compress and convert image to WebP
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1600,
  quality: number = 0.8
): Promise<CompressedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            const compressedFile = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            
            const dataUrl = canvas.toDataURL('image/webp', quality);
            
            resolve({
              file: compressedFile,
              dataUrl,
              width,
              height,
            });
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Generate multiple size variants of an image
 */
export const generateImageVariants = async (
  file: File
): Promise<Record<string, CompressedImage>> => {
  const variants: Record<string, CompressedImage> = {};
  
  for (const variant of IMAGE_VARIANTS) {
    const compressed = await compressImage(
      file,
      variant.maxWidth,
      variant.quality / 100
    );
    variants[variant.name] = compressed;
  }
  
  return variants;
};

/**
 * Validate image file
 */
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPG, PNG, or WebP images.',
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 10MB.',
    };
  }
  
  return { valid: true };
};

/**
 * Get optimized Supabase Storage URL with transformations
 */
export const getSupabaseImageUrl = (
  path: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  }
): string => {
  if (!path) return '';
  
  const baseUrl = `https://thxrxacsrwtadvvdwken.supabase.co/storage/v1/render/image/public/${path}`;
  const params = new URLSearchParams();
  
  if (options?.width) params.append('width', options.width.toString());
  if (options?.height) params.append('height', options.height.toString());
  params.append('quality', (options?.quality || 70).toString());
  params.append('format', options?.format || 'webp');
  
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Calculate image dimensions while maintaining aspect ratio
 */
export const calculateAspectRatioDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight?: number
): { width: number; height: number } => {
  const aspectRatio = originalWidth / originalHeight;
  
  let width = maxWidth;
  let height = maxWidth / aspectRatio;
  
  if (maxHeight && height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }
  
  return { width: Math.round(width), height: Math.round(height) };
};
