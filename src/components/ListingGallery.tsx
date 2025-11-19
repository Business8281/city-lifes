import { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

interface ListingGalleryProps {
  images: string[];
  title: string;
}

const ListingGallery = ({ images, title }: ListingGalleryProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Handle empty or invalid images array
  const validImages = Array.isArray(images) ? images.filter(img => img && typeof img === 'string') : [];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

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

  return (
    <div className="w-full">
      <div className="relative group">
        {/* Main Carousel */}
        <div 
          className="overflow-hidden rounded-none md:rounded-lg"
          ref={emblaRef}
        >
          <div className="flex touch-pan-y">
            {validImages.map((src, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] min-w-0 aspect-square"
              >
                <img
                  src={src}
                  alt={`${title} - Image ${i + 1}`}
                  className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-105"
                  draggable={false}
                  loading="lazy"
                  onClick={() => openLightbox(i)}
                  onError={(e) => {
                    console.error('Image failed to load:', src);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {validImages.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  selectedIndex === i ? 'bg-white w-8' : 'bg-white/50 w-2'
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute top-3 right-3 bg-black/55 text-white text-xs px-2.5 py-1 rounded z-10">
          {selectedIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Thumbnail Strip for Desktop */}
      {validImages.length > 1 && (
        <div className="mt-3 hidden md:flex gap-2 overflow-x-auto pb-1">
          {validImages.map((src, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                selectedIndex === i 
                  ? 'border-primary ring-2 ring-primary/50' 
                  : 'border-border hover:border-primary/50'
              )}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 z-50 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {validImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 hover:bg-black/60 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 hover:bg-black/60 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all"
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
