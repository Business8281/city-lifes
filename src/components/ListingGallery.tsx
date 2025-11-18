import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ListingGalleryProps {
  images: string[];
  title: string;
}

// Detect extreme aspect ratios and return a class for the hero slot
const classifyRatio = (width: number, height: number) => {
  if (!width || !height) return 'normal';
  const ratio = width / height; // >1 wide
  if (ratio > 2) return 'very-wide';
  if (ratio < 0.6) return 'very-tall';
  return 'normal';
};

const ListingGallery = ({ images, title }: ListingGalleryProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [ratios, setRatios] = useState<string[]>([]);
  
  // Handle empty or invalid images array
  const validImages = Array.isArray(images) ? images.filter(img => img && typeof img === 'string') : [];
  const isMultiple = validImages.length > 1;

  // Load image dimensions once for adaptive styling
  useEffect(() => {
    if (validImages.length === 0) return;
    const promises = validImages.map(src => new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(classifyRatio(img.width, img.height));
      img.onerror = () => {
        console.error('Failed to load image:', src);
        resolve('normal');
      };
      img.src = src;
    }));
    Promise.all(promises).then(setRatios);
  }, [validImages]);

  // Track selected slide
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActive(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
        <div
          className={cn(
            'overflow-hidden w-full bg-muted rounded-none md:rounded-lg',
            'aspect-square'
          )}
          ref={emblaRef}
        >
          <div className="flex touch-pan-y select-none" style={{ height: '100%' }}>
            {validImages.map((src, i) => {
              return (
                <div 
                  className="flex-[0_0_100%] relative min-w-0" 
                  style={{ height: '100%' }}
                  key={i}
                >
                  <img
                    src={src}
                    alt={`${title} - Image ${i + 1}`}
                    onClick={() => setLightbox(true)}
                    className="w-full h-full object-cover cursor-zoom-in transition-opacity duration-300 select-none"
                    draggable={false}
                    loading="eager"
                    onError={(e) => {
                      console.error('Image failed to load:', src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {isMultiple && (
          <>
            <button
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm"
            >
              ‹
            </button>
            <button
              aria-label="Next image"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm"
            >
              ›
            </button>
          </>
        )}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 pointer-events-none">
          {validImages.map((_, i) => (
            <div
              key={i}
              className={cn('h-2 rounded-full transition-all', active === i ? 'bg-white w-8' : 'bg-white/50 w-2')}
            />
          ))}
        </div>
        {validImages.length > 0 && (
          <div className="absolute top-3 right-3 bg-black/55 text-white text-xs px-2 py-1 rounded">
            {active + 1} / {validImages.length}
          </div>
        )}
      </div>

      {isMultiple && (
        <div className="mt-2 hidden md:flex gap-2 overflow-x-auto pb-1">
          {validImages.map((src, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={cn('relative h-16 w-24 shrink-0 rounded-md overflow-hidden border', active === i ? 'border-primary' : 'border-border')}
            >
              <img src={src} alt={title} className="w-full h-full object-cover" />
              {active === i && <div className="absolute inset-0 ring-2 ring-primary/70 rounded-md" />}
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="p-0 max-w-[95vw] max-h-[95vh] flex flex-col bg-black border border-border">
          <div className="relative aspect-square w-full max-w-[min(95vw,95vh)] mx-auto">
            <img
              src={validImages[active]}
              alt={title}
              className="w-full h-full object-cover cursor-zoom-out"
              onClick={() => setLightbox(false)}
            />
            {isMultiple && (
              <>
                <button
                  aria-label="Previous image"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ‹
                </button>
                <button
                  aria-label="Next image"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ›
                </button>
              </>
            )}
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {active + 1} / {validImages.length}
            </div>
          </div>
          {isMultiple && (
            <div className="flex gap-2 p-3 overflow-x-auto bg-black/60">
              {validImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={cn('relative h-14 w-20 shrink-0 rounded-md overflow-hidden border', active === i ? 'border-primary' : 'border-border')}
                >
                  <img src={src} alt={title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListingGallery;