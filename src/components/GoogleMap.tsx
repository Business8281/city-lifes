import { useEffect, useRef, useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { Button } from './ui/button';
import { Navigation } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

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

    return (
        <div className="relative h-full w-full">
            <Map
                mapId="DEMO_MAP_ID"
                defaultCenter={center}
                defaultZoom={zoom}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                className="h-full w-full"
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
                    .map((cluster, index) => (
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
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full border-2 border-white shadow-lg font-bold hover:scale-110 transition-transform cursor-pointer">
                                {cluster.property_count}
                            </div>
                        </AdvancedMarker>
                    ))}

                {/* Properties */}
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
                                zIndex={isSelected ? 100 : 1}
                            >
                                <div
                                    className="relative group"
                                    onMouseEnter={() => setHoveredPropertyId(property.id)}
                                    onMouseLeave={() => setHoveredPropertyId(null)}
                                >
                                    {/* Price Tag Marker */}
                                    <div className={`
                                        px-2 py-1 rounded-full border shadow-md text-xs font-bold transition-all duration-200
                                        ${isSelected
                                            ? 'bg-green-600 text-white border-green-700 scale-110'
                                            : 'bg-white text-gray-900 border-gray-200 hover:scale-105 hover:border-green-500 hover:text-green-600'
                                        }
                                    `}>
                                        ₹{(property.price / 1000).toFixed(1)}k
                                    </div>

                                    {/* Hover/Select Popup */}
                                    {showDetails && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[240px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="relative h-32 w-full">
                                                <OptimizedImage
                                                    src={property.images?.[0] || '/placeholder.svg'}
                                                    alt={property.title}
                                                    className="object-cover w-full h-full"
                                                />
                                                {property.verified && (
                                                    <Badge className="absolute top-2 left-2 bg-green-500/90 hover:bg-green-600/90 backdrop-blur-sm">
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <h3 className="font-semibold text-sm line-clamp-1 mb-1">{property.title}</h3>
                                                <div className="flex items-baseline gap-1 mb-1">
                                                    <span className="text-lg font-bold text-green-600">₹{property.price.toLocaleString()}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {property.price_type === 'monthly' ? '/mo' : ''}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
                                                    {property.area}, {property.city}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    className="w-full h-8 text-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/property/${property.id}`);
                                                    }}
                                                >
                                                    View Details
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
            <div className="absolute bottom-24 right-4 z-[1000]">
                <Button
                    size="icon"
                    className="rounded-full shadow-lg bg-white hover:bg-gray-100 text-gray-900 h-10 w-10"
                    onClick={onUserLocationClick}
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
