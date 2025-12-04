import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Property } from '@/types/database';
import { OptimizedImage } from './OptimizedImage';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons in Leaflet with Webpack/Vite
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
    onBoundsChange: (bounds: any, zoom: number) => void;
    userLocation?: { lat: number; lng: number };
    onUserLocationClick?: () => void;
    selectedPropertyId?: string | null;
    onPropertySelect?: (property: any) => void;
}

// Component to handle map events (move, zoom)
const MapEvents = ({ onBoundsChange }: { onBoundsChange: (bounds: any, zoom: number) => void }) => {
    const map = useMapEvents({
        moveend: () => {
            onBoundsChange(map.getBounds(), map.getZoom());
        },
        zoomend: () => {
            onBoundsChange(map.getBounds(), map.getZoom());
        },
    });
    return null;
};

// Component to update map center when props change
const MapUpdater = ({ center, zoom }: { center: { lat: number; lng: number }, zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], zoom);
    }, [center, zoom, map]);
    return null;
};

const createPriceIcon = (price: number, isSelected: boolean) => {
    const formattedPrice = `₹${(price / 1000).toFixed(1)}k`;
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
      background-color: ${isSelected ? '#22c55e' : 'white'};
      color: ${isSelected ? 'white' : 'black'};
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 12px;
      border: 1px solid #ccc;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      white-space: nowrap;
      transform: translate(-50%, -50%);
    ">${formattedPrice}</div>`,
        iconSize: [40, 20],
        iconAnchor: [20, 10],
    });
};

const userLocationIcon = L.divIcon({
    className: 'user-location-icon',
    html: `<div style="
    background-color: #3b82f6;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 2px #3b82f6;
  "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

import { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("LeafletMap Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">Something went wrong with the map.</div>;
        }

        return this.props.children;
    }
}

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
}: LeafletMapProps & { clusters?: any[] }) => {
    const navigate = useNavigate();

    return (
        <ErrorBoundary>
            <div className="relative h-full w-full z-0">
                <MapContainer
                    center={[center.lat, center.lng]}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapEvents onBoundsChange={onBoundsChange} />
                    <MapUpdater center={center} zoom={zoom} />

                    {/* User Location Marker */}
                    {userLocation && (
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                            <Popup>You are here</Popup>
                        </Marker>
                    )}

                    {/* Clusters */}
                    {clusters
                        .filter(c => !isNaN(Number(c.cluster_lat)) && !isNaN(Number(c.cluster_lng)))
                        .map((cluster, index) => (
                            <Marker
                                key={`cluster-${index}`}
                                position={[Number(cluster.cluster_lat), Number(cluster.cluster_lng)]}
                                icon={L.divIcon({
                                    className: 'cluster-icon',
                                    html: `<div style="
                                    background-color: #3b82f6;
                                    color: white;
                                    width: 30px;
                                    height: 30px;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-weight: bold;
                                    border: 2px solid white;
                                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                                ">${cluster.property_count}</div>`,
                                    iconSize: [30, 30],
                                })}
                                eventHandlers={{
                                    click: (e) => {
                                        const map = e.target._map;
                                        map.setView([cluster.cluster_lat, cluster.cluster_lng], map.getZoom() + 2);
                                    },
                                }}
                            />
                        ))}

                    {/* Property Markers (only if no clusters or high zoom) */}
                    {properties
                        .filter(p => p.latitude && p.longitude && !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude)))
                        .map((property) => {
                            const isSelected = selectedPropertyId === property.id;

                            return (
                                <Marker
                                    key={property.id}
                                    position={[Number(property.latitude), Number(property.longitude)]}
                                    icon={createPriceIcon(property.price, isSelected)}
                                    eventHandlers={{
                                        click: () => onPropertySelect?.(property),
                                    }}
                                >
                                    <Popup className="property-popup">
                                        <div className="w-[200px] p-0">
                                            <div className="relative h-32 w-full mb-2 rounded-md overflow-hidden">
                                                <OptimizedImage
                                                    src={property.images?.[0] || '/placeholder.svg'}
                                                    alt={property.title}
                                                    className="object-cover w-full h-full"
                                                />
                                                {property.verified && (
                                                    <Badge className="absolute top-2 left-2" variant="secondary">Verified</Badge>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-sm line-clamp-1">{property.title}</h3>
                                            <p className="text-primary font-bold">₹{property.price.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{property.area}, {property.city}</p>
                                            <Button
                                                size="sm"
                                                className="w-full mt-2"
                                                onClick={() => navigate(`/property/${property.id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                </MapContainer>

                {/* Custom Controls */}
                <div className="absolute bottom-24 right-4 z-[1000]">
                    <Button
                        size="icon"
                        className="rounded-full shadow-lg bg-background hover:bg-accent text-foreground"
                        onClick={onUserLocationClick}
                    >
                        <Navigation className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </ErrorBoundary>
    );
};
