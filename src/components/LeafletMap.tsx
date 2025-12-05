import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { Navigation, Layers } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
    center: { lat: number; lng: number };
    zoom: number;
    properties: any[];
    clusters?: any[];
    onBoundsChange: (bounds: any, zoom: number) => void;
    userLocation?: { lat: number; lng: number };
    onUserLocationClick?: () => void;
    selectedPropertyId?: string | null;
    onPropertySelect?: (property: any) => void;
    isLoading?: boolean;
}

// Custom price marker icon
const createPriceIcon = (price: number, isSelected: boolean, isHovered: boolean) => {
    const formatPrice = (p: number) => {
        if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr`;
        if (p >= 100000) return `₹${(p / 100000).toFixed(1)}L`;
        return `₹${(p / 1000).toFixed(0)}K`;
    };

    const priceText = formatPrice(price);
    const bgColor = isSelected ? '#0066cc' : isHovered ? '#0077dd' : '#ffffff';
    const textColor = isSelected || isHovered ? '#ffffff' : '#1a1a1a';
    const borderColor = isSelected || isHovered ? '#0066cc' : '#d1d5db';
    const scale = isSelected ? 1.1 : isHovered ? 1.05 : 1;

    return L.divIcon({
        className: 'custom-price-marker',
        html: `
      <div style="
        transform: scale(${scale});
        transition: all 0.2s ease;
      ">
        <div style="
          background: ${bgColor};
          color: ${textColor};
          padding: 6px 12px;
          border-radius: 20px;
          border: 2px solid ${borderColor};
          font-weight: bold;
          font-size: 13px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          cursor: pointer;
        ">
          ${priceText}
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid ${bgColor};
          margin: -1px auto 0;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
        "></div>
      </div>
    `,
        iconSize: [80, 40],
        iconAnchor: [40, 40],
    });
};

// Cluster icon
const createClusterIcon = (count: number, isHovered: boolean) => {
    const size = isHovered ? 60 : 50;
    const bgColor = isHovered ? '#0066cc' : '#0077dd';

    return L.divIcon({
        className: 'custom-cluster-marker',
        html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${bgColor};
        border: 4px solid white;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-center;
        color: white;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        <span style="font-size: ${isHovered ? '20px' : '18px'};">${count}</span>
        ${isHovered ? '<span style="font-size: 10px;">properties</span>' : ''}
      </div>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
};

// Map controller component
const MapController = ({ center, zoom, onBoundsChange }: any) => {
    const map = useMap();
    const boundsRef = useRef<string>('');

    useEffect(() => {
        map.setView([center.lat, center.lng], zoom);
    }, [center, zoom, map]);

    useEffect(() => {
        const handleMoveEnd = () => {
            const bounds = map.getBounds();
            const currentZoom = map.getZoom();
            const boundsStr = bounds.toString();

            if (boundsStr !== boundsRef.current) {
                boundsRef.current = boundsStr;
                onBoundsChange({
                    getNorthEast: () => ({
                        lat: () => bounds.getNorthEast().lat,
                        lng: () => bounds.getNorthEast().lng,
                    }),
                    getSouthWest: () => ({
                        lat: () => bounds.getSouthWest().lat,
                        lng: () => bounds.getSouthWest().lng,
                    }),
                    toJSON: () => ({
                        north: bounds.getNorthEast().lat,
                        east: bounds.getNorthEast().lng,
                        south: bounds.getSouthWest().lat,
                        west: bounds.getSouthWest().lng,
                    }),
                }, currentZoom);
            }
        };

        map.on('moveend', handleMoveEnd);
        return () => {
            map.off('moveend', handleMoveEnd);
        };
    }, [map, onBoundsChange]);

    return null;
};

export const LeafletMap = ({
    center,
    zoom,
    properties,
    clusters = [],
    onBoundsChange,
    userLocation,
    onUserLocationClick,
    selectedPropertyId,
    onPropertySelect,
    isLoading = false,
}: LeafletMapProps) => {
    const navigate = useNavigate();
    const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
    const [hoveredClusterId, setHoveredClusterId] = useState<number | null>(null);
    const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)}L`;
        return `₹${(price / 1000).toFixed(0)}K`;
    };

    const tileLayerUrl = mapType === 'streets'
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={zoom}
                className="h-full w-full"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={tileLayerUrl}
                />

                <MapController center={center} zoom={zoom} onBoundsChange={onBoundsChange} />

                {/* User Location */}
                {userLocation && (
                    <>
                        <Circle
                            center={[userLocation.lat, userLocation.lng]}
                            radius={50}
                            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.3 }}
                        />
                        <Marker position={[userLocation.lat, userLocation.lng]}>
                            <Popup>Your Location</Popup>
                        </Marker>
                    </>
                )}

                {/* Clusters */}
                {clusters
                    .filter(c => !isNaN(Number(c.cluster_lat)) && !isNaN(Number(c.cluster_lng)))
                    .map((cluster, index) => (
                        <Marker
                            key={`cluster-${index}`}
                            position={[Number(cluster.cluster_lat), Number(cluster.cluster_lng)]}
                            icon={createClusterIcon(cluster.property_count, hoveredClusterId === index)}
                            eventHandlers={{
                                mouseover: () => setHoveredClusterId(index),
                                mouseout: () => setHoveredClusterId(null),
                            }}
                        >
                            <Popup>
                                <div className="text-center">
                                    <p className="font-bold">{cluster.property_count} Properties</p>
                                    <p className="text-sm text-muted-foreground">Zoom in to see details</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                {/* Properties */}
                {properties
                    .filter(p => p.latitude && p.longitude && !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude)))
                    .map((property) => {
                        const isSelected = selectedPropertyId === property.id;
                        const isHovered = hoveredPropertyId === property.id;

                        return (
                            <Marker
                                key={property.id}
                                position={[Number(property.latitude), Number(property.longitude)]}
                                icon={createPriceIcon(property.price, isSelected, isHovered)}
                                eventHandlers={{
                                    click: () => onPropertySelect?.(property),
                                    mouseover: () => setHoveredPropertyId(property.id),
                                    mouseout: () => setHoveredPropertyId(null),
                                }}
                            >
                                <Popup maxWidth={300}>
                                    <div className="w-[280px]">
                                        <div className="relative h-40 w-full mb-3">
                                            <OptimizedImage
                                                src={property.images?.[0] || '/placeholder.svg'}
                                                alt={property.title}
                                                className="object-cover w-full h-full rounded-lg"
                                            />
                                            {property.verified && (
                                                <Badge className="absolute top-2 left-2 bg-green-500/90">
                                                    ✓ Verified
                                                </Badge>
                                            )}
                                            <Badge className="absolute top-2 right-2 bg-black/60 text-white">
                                                {property.property_type}
                                            </Badge>
                                        </div>
                                        <h3 className="font-bold text-base mb-2">{property.title}</h3>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-2xl font-bold text-primary">{formatPrice(property.price)}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {property.price_type === 'monthly' ? '/month' : ''}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            📍 {property.area}, {property.city}
                                        </p>
                                        {property.bedrooms && (
                                            <p className="text-sm text-muted-foreground mb-3">
                                                🛏️ {property.bedrooms} Beds • 🚿 {property.bathrooms || 1} Baths
                                            </p>
                                        )}
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/property/${property.id}`);
                                            }}
                                        >
                                            View Details →
                                        </Button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
            </MapContainer>

            {/* Custom Controls */}
            <div className="absolute bottom-24 right-4 z-[1000] flex flex-col gap-2">
                {/* Map Type Toggle */}
                <Button
                    size="icon"
                    className="rounded-full shadow-lg bg-white hover:bg-gray-100 text-gray-900 h-11 w-11"
                    onClick={() => setMapType(prev => prev === 'streets' ? 'satellite' : 'streets')}
                    title={mapType === 'streets' ? 'Satellite View' : 'Map View'}
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

            {/* Loading Indicator */}
            {isLoading && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-primary">Updating map...</span>
                </div>
            )}
        </div>
    );
};
