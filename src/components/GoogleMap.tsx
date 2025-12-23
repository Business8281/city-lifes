import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { Button } from './ui/button';
import { Navigation, Layers } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { Badge } from './ui/badge';

interface GoogleMapProps {
    apiKey: string;
    center: { lat: number; lng: number };
    zoom: number;
    properties: any[];
    clusters?: any[];
    onBoundsChange: (bounds: any, zoom: number) => void;
    userLocation?: { lat: number; lng: number };
    onUserLocationClick?: () => void;
    selectedPropertyId?: string | null;
    onPropertySelect?: (property: any) => void;
}

const MapEvents = ({ onBoundsChange }: { onBoundsChange: (bounds: any, zoom: number) => void }) => {
    const map = useMap();
    const prevBoundsRef = useRef<string>("");

    useEffect(() => {
        if (!map) return;

        const listener = map.addListener('idle', () => {
            const bounds = map.getBounds();
            const zoom = map.getZoom();

            if (bounds && zoom) {
                const boundsStr = bounds.toString();
                if (boundsStr !== prevBoundsRef.current) {
                    prevBoundsRef.current = boundsStr;
                    onBoundsChange(bounds, zoom);
                }
            }
        });

        return () => google.maps.event.removeListener(listener);
    }, [map, onBoundsChange]);

    return null;
};

const MapUpdater = ({ center, zoom }: { center: { lat: number; lng: number }, zoom: number }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        map.setCenter(center);
        map.setZoom(zoom);
    }, [center, zoom, map]);

    return null;
};

const GoogleMapContent = ({
    center,
    zoom,
    properties,
    clusters = [],
    onBoundsChange,
    userLocation,
    onUserLocationClick,
    selectedPropertyId,
    onPropertySelect,
}: Omit<GoogleMapProps, 'apiKey'>) => {
    const map = useMap();
    const navigate = useNavigate();
    const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
    const [hoveredClusterId, setHoveredClusterId] = useState<number | null>(null);
    const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite'>('roadmap');

    const toggleMapType = () => {
        setMapTypeId(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');
        if (map) {
            map.setMapTypeId(mapTypeId === 'roadmap' ? 'satellite' : 'roadmap');
        }
    };

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)}L`;
        return `₹${(price / 1000).toFixed(0)}K`;
    };

    return (
        <div className="relative h-full w-full">
            <Map
                defaultCenter={center}
                defaultZoom={zoom}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapTypeId={mapTypeId}
                className="h-full w-full"
                styles={[
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    }
                ]}
            >
                <MapEvents onBoundsChange={onBoundsChange} />
                <MapUpdater center={center} zoom={zoom} />

                {/* User Location */}
                {userLocation && (
                    <AdvancedMarker position={userLocation}>
                        <div className="relative flex items-center justify-center w-6 h-6">
                            <div className="absolute w-full h-full bg-blue-500 rounded-full opacity-30 animate-ping" />
                            <div className="relative w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg" />
                        </div>
                    </AdvancedMarker>
                )}

                {/* Clusters */}
                {clusters
                    .filter(c => !isNaN(Number(c.cluster_lat)) && !isNaN(Number(c.cluster_lng)))
                    .map((cluster, index) => {
                        const isHovered = hoveredClusterId === index;
                        return (
                            <AdvancedMarker
                                key={`cluster-${index}`}
                                position={{ lat: Number(cluster.cluster_lat), lng: Number(cluster.cluster_lng) }}
                                onClick={() => {
                                    if (map) {
                                        map.setCenter({ lat: Number(cluster.cluster_lat), lng: Number(cluster.cluster_lng) });
                                        map.setZoom((map.getZoom() || 10) + 2);
                                    }
                                }}
                            >
                                <div
                                    className={`
                                        flex flex-col items-center justify-center rounded-full
                                        border-4 border-white shadow-xl font-bold cursor-pointer
                                        transition-all duration-200
                                        ${isHovered
                                            ? 'w-16 h-16 bg-primary text-primary-foreground scale-110'
                                            : 'w-12 h-12 bg-primary/90 text-primary-foreground'
                                        }
                                    `}
                                    onMouseEnter={() => setHoveredClusterId(index)}
                                    onMouseLeave={() => setHoveredClusterId(null)}
                                >
                                    <span className="text-lg">{cluster.property_count}</span>
                                    {isHovered && (
                                        <span className="text-[10px] font-normal">properties</span>
                                    )}
                                </div>
                            </AdvancedMarker>
                        );
                    })}

                {/* Properties with new PropertyMarker component */}
                {properties
                    .filter(p => p.latitude && p.longitude && !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude)))
                    .map((property) => {
                        const isSelected = selectedPropertyId === property.id;
                        const isHovered = hoveredPropertyId === property.id;
                        const showDetails = isSelected || isHovered;

                        return (
                            <AdvancedMarker
                                key={property.id}
                                position={{ lat: Number(property.latitude), lng: Number(property.longitude) }}
                                onClick={() => onPropertySelect?.(property)}
                                zIndex={isSelected ? 1000 : isHovered ? 999 : 1}
                            >
                                <div
                                    className="relative group"
                                    onMouseEnter={() => setHoveredPropertyId(property.id)}
                                    onMouseLeave={() => setHoveredPropertyId(null)}
                                >
                                    {/* Zillow-style Price Tag Marker */}
                                    <div
                                        className={`
                                            px-3 py-1.5 rounded-full font-bold text-sm shadow-lg
                                            transition-all duration-200 cursor-pointer
                                            ${isSelected
                                                ? 'bg-primary text-primary-foreground scale-110 ring-2 ring-primary/50'
                                                : isHovered
                                                    ? 'bg-primary/90 text-primary-foreground scale-105'
                                                    : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-primary'
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
                                            border-t-[8px] transition-all duration-200
                                            ${isSelected
                                                ? 'border-t-primary'
                                                : isHovered
                                                    ? 'border-t-primary/90'
                                                    : 'border-t-white'
                                            }
                                        `}
                                        style={{ bottom: '-7px' }}
                                    />

                                    {/* Hover/Select Popup */}
                                    {showDetails && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[280px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[1001] animate-in fade-in zoom-in-95 duration-200">
                                            <div className="relative h-40 w-full">
                                                <OptimizedImage
                                                    src={property.images?.[0] || '/placeholder.svg'}
                                                    alt={property.title}
                                                    className="object-cover w-full h-full"
                                                />
                                                {property.verified && (
                                                    <Badge className="absolute top-2 left-2 bg-green-500/90 hover:bg-green-600/90 backdrop-blur-sm">
                                                        ✓ Verified
                                                    </Badge>
                                                )}
                                                <Badge className="absolute top-2 right-2 bg-black/60 hover:bg-black/70 backdrop-blur-sm text-white">
                                                    {property.property_type}
                                                </Badge>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-base line-clamp-1 mb-2">{property.title}</h3>
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <span className="text-2xl font-bold text-primary">{formatPrice(property.price)}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {property.price_type === 'monthly' ? '/month' : ''}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                                                    📍 {property.area}, {property.city}
                                                </p>
                                                {property.bedrooms && (
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        🛏️ {property.bedrooms} Beds • 🚿 {property.bathrooms || 1} Baths
                                                    </p>
                                                )}
                                                <Button
                                                    size="sm"
                                                    className="w-full h-9 text-sm font-semibold"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/property/${property.id}`);
                                                    }}
                                                >
                                                    View Details →
                                                </Button>
                                            </div>
                                            {/* Arrow */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-200"></div>
                                        </div>
                                    )}
                                </div>
                            </AdvancedMarker>
                        );
                    })}
            </Map>

            {/* Custom Controls */}
            <div className="absolute bottom-24 right-4 z-[1000] flex flex-col gap-2">
                {/* Map Type Toggle */}
                <Button
                    size="icon"
                    className="rounded-full shadow-lg bg-white hover:bg-gray-100 text-gray-900 h-11 w-11"
                    onClick={toggleMapType}
                    title={mapTypeId === 'roadmap' ? 'Satellite View' : 'Map View'}
                >
                    <Layers className="h-5 w-5" />
                </Button>

                {/* User Location */}
                <Button
                    size="icon"
                    className="rounded-full shadow-lg bg-white hover:bg-gray-100 text-gray-900 h-11 w-11"
                    onClick={onUserLocationClick}
                    title="My Location"
                >
                    <Navigation className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

export const GoogleMap = ({ apiKey, ...props }: GoogleMapProps) => {
    return (
        <APIProvider apiKey={apiKey}>
            <GoogleMapContent {...props} />
        </APIProvider>
    );
};
