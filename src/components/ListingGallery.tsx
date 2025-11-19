import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ListingGalleryProps {
  images: string[];
  title: string;
}

const ListingGallery = ({ images, title }: ListingGalleryProps) => {
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Handle empty or invalid images array
  const validImages = Array.isArray(images) ? images.filter(img => img && typeof img === 'string') : [];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightbox(true);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  // Show placeholder if no images
  if (validImages.length === 0) {
    return (
      <div className="w-full">
        <div className="aspect-square w-full bg-muted rounded-none md:rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </div>
    );
  }

  // Determine grid layout based on number of images
  const getGridLayout = () => {
    if (validImages.length === 1) return 'grid-cols-1';
    if (validImages.length === 2) return 'grid-cols-2';
    if (validImages.length === 3) return 'grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  return (
    <div className="w-full">
      <div className={cn(
        'grid gap-2 w-full',
        getGridLayout()
      )}>
        {validImages.map((src, i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded-none md:rounded-lg overflow-hidden cursor-pointer group relative"
            onClick={() => openLightbox(i)}
          >
            <img
              src={src}
              alt={`${title} - Image ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              draggable={false}
              loading="lazy"
              onError={(e) => {
                console.error('Image failed to load:', src);
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 z-50 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {validImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 hover:bg-black/60 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 hover:bg-black/60 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-50">
              {validImages.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    lightboxIndex === i ? 'bg-white w-8' : 'bg-white/50 w-2'
                  )}
                />
              ))}
            </div>

            <div className="absolute top-4 left-4 bg-black/55 text-white text-sm px-3 py-1.5 rounded z-50">
              {lightboxIndex + 1} / {validImages.length}
            </div>

            <img
              src={validImages[lightboxIndex]}
              alt={`${title} - Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              draggable={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListingGallery;
