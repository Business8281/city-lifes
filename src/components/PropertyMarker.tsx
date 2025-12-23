import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Home } from 'lucide-react';

interface PropertyMarkerProps {
    property: any;
    isSelected?: boolean;
    isHovered?: boolean;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export function PropertyMarker({
    property,
    isSelected = false,
    isHovered = false,
    onClick,
    onMouseEnter,
    onMouseLeave,
}: PropertyMarkerProps) {
    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)}L`;
        return `₹${(price / 1000).toFixed(0)}K`;
    };

    return (
        <AdvancedMarker
            position={{ lat: property.latitude, lng: property.longitude }}
            onClick={onClick}
        >
            <div
                className="relative cursor-pointer transition-all duration-200"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{
                    transform: isSelected || isHovered ? 'scale(1.1)' : 'scale(1)',
                    zIndex: isSelected ? 1000 : isHovered ? 999 : 1,
                }}
            >
                {/* Price Badge */}
                <div
                    className={`
            px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg
            transition-all duration-200
            ${isSelected
                            ? 'bg-primary text-primary-foreground scale-110'
                            : isHovered
                                ? 'bg-primary/90 text-primary-foreground'
                                : 'bg-white text-gray-900 border-2 border-gray-200'
                        }
          `}
                >
                    {formatPrice(property.price)}
                </div>

                {/* Arrow pointer */}
                <div
                    className={`
            absolute left-1/2 -translate-x-1/2 w-0 h-0
            border-l-[6px] border-l-transparent
            border-r-[6px] border-r-transparent
            border-t-[8px]
            ${isSelected
                            ? 'border-t-primary'
                            : isHovered
                                ? 'border-t-primary/90'
                                : 'border-t-white'
                        }
          `}
                    style={{ bottom: '-7px' }}
                />

                {/* Property type icon (shown on hover/select) */}
                {(isHovered || isSelected) && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-full p-1.5 shadow-md">
                        <Home className="h-4 w-4 text-primary" />
                    </div>
                )}
            </div>
        </AdvancedMarker>
    );
}
