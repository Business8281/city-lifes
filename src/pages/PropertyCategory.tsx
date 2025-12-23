import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import LocationSelector from "@/components/LocationSelector";
import { propertyTypes } from "@/data/propertyTypes";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useProperties } from "@/hooks/useProperties";
import { useLocation } from "@/contexts/LocationContext";
import { useSponsoredProperties } from "@/hooks/useSponsoredProperties";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const PropertyCategory = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [locationDialogOpen, setLocationDialogOpen] = useState(false);
    const [displayedCount, setDisplayedCount] = useState(12);

    // Derive the current type object for labels/icons
    const currentType = propertyTypes.find((t) => t.type === type);

    const filters = useMemo(() => ({
        searchQuery: searchQuery,
        propertyType: type === 'all' ? undefined : type, // Handle 'all' to show everything
        sortBy: sortBy as 'recent' | 'price-low' | 'price-high'
    }), [searchQuery, type, sortBy]);

    const { properties, loading } = useProperties(filters);
    const { location } = useLocation();
    const { sponsoredProperties: rawSponsoredProperties, loading: sponsoredLoading, incrementClicks, incrementImpressions } = useSponsoredProperties(location);
    const sponsoredRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const trackedImpressions = useRef<Set<string>>(new Set());
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Filter ads: Show only if category matches or if type is 'all'
    const sponsoredProperties = rawSponsoredProperties.filter(property =>
        type === 'all' || property.property_type === type
    );

    // Track impressions for sponsored properties
    useEffect(() => {
        if (sponsoredProperties.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const campaignId = entry.target.getAttribute('data-campaign-id');
                        if (campaignId && !trackedImpressions.current.has(campaignId)) {
                            trackedImpressions.current.add(campaignId);
                            incrementImpressions(campaignId);
                        }
                    }
                });
            },
            { threshold: 0.5, rootMargin: '0px' }
        );

        sponsoredRefs.current.forEach((element) => {
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [sponsoredProperties, incrementImpressions]);

    const setSponsoredRef = useCallback((element: HTMLDivElement | null, campaignId: string) => {
        if (element) {
            sponsoredRefs.current.set(campaignId, element);
        } else {
            sponsoredRefs.current.delete(campaignId);
        }
    }, []);

    const displayedProperties = properties.slice(0, displayedCount);

    // Infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && displayedCount < properties.length) {
                    setDisplayedCount(prev => Math.min(prev + 12, properties.length));
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [displayedCount, properties.length]);

    // Reset count on filter change
    useEffect(() => {
        setDisplayedCount(12);
    }, [type, searchQuery, sortBy, location.value]);

    if (!currentType && type !== 'all') {
        // Fallback for invalid types? Or let it show empty.
    }

    return (
        <div className="min-h-screen bg-background pb-4 md:pb-0 overflow-x-hidden max-w-full">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background border-b border-border max-w-full overflow-x-hidden">
                <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 overflow-x-hidden">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/")}
                            className="shrink-0"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <div className="flex flex-col">
                            <h1 className="text-lg font-semibold flex items-center gap-2">
                                <span>{currentType?.icon || '🏠'}</span>
                                {currentType?.label || 'Properties'}
                            </h1>
                            {location.value && <span className="text-xs text-muted-foreground">in {location.value}</span>}
                        </div>

                        {type === 'business' && (
                            <div className="flex-1 ml-2">
                                <SearchBar
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                    placeholder="Search businesses..."
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 px-3 h-auto py-2 hover:bg-accent"
                            onClick={() => setLocationDialogOpen(true)}
                        >
                            <MapPin className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-base">
                                {location.method === 'live' && location.coordinates
                                    ? 'Live Location'
                                    : location.value
                                        ? location.value
                                        : 'All cities'}
                            </span>
                        </Button>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[160px] h-9">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <LocationSelector open={locationDialogOpen} onOpenChange={setLocationDialogOpen} />

                    <p className="text-sm text-muted-foreground px-1">
                        {loading ? 'Loading...' : `Showing ${displayedProperties.length} of ${properties.length} ${currentType?.label || 'properties'}`}
                    </p>
                </div>
            </div>

            {/* Properties Grid */}
            <div className="max-w-7xl mx-auto px-4 py-6 overflow-x-hidden space-y-6">

                {/* Browse by Category - Quick Switch */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-foreground">Browse by Category</h2>
                        <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate("/listings")}>
                            View All
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {propertyTypes.map(typeData => (
                            <div
                                key={typeData.type}
                                onClick={() => navigate(`/category/${typeData.type}`)}
                                className={`
                                    flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 shrink-0
                                    ${type === typeData.type
                                        ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                        : 'bg-card border-border hover:border-primary hover:shadow-sm'
                                    }
                                `}
                            >
                                <span className="text-lg">{typeData.icon}</span>
                                <span className={`font-medium ${type === typeData.type ? 'text-primary' : 'text-foreground'}`}>
                                    {typeData.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sponsored Ads Section - Only if matches category */}
                {!sponsoredLoading && sponsoredProperties.length > 0 && (
                    <div className="space-y-3 bg-amber-50/50 dark:bg-amber-950/10 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold">Sponsored {currentType?.label}</h2>
                                <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full font-medium">
                                    AD
                                </span>
                            </div>
                        </div>
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {sponsoredProperties.map((property) => (
                                    <CarouselItem key={property.id} className="pl-2 md:pl-4 basis-[280px] sm:basis-[300px] md:basis-1/3 lg:basis-1/4">
                                        <div
                                            ref={(el) => property.campaign_id && setSponsoredRef(el, property.campaign_id)}
                                            data-campaign-id={property.campaign_id}
                                            className="bg-white dark:bg-gray-900 rounded-lg h-full"
                                        >
                                            <PropertyCard
                                                id={property.id}
                                                image={property.images[0] || '/placeholder.svg'}
                                                title={property.title}
                                                type={propertyTypes.find(t => t.type === property.property_type)?.icon || '🏠'}
                                                propertyType={property.property_type}
                                                price={`₹${property.price.toLocaleString()}`}
                                                priceType={property.price_type}
                                                location={`${property.area}, ${property.city}`}
                                                bedrooms={property.bedrooms || undefined}
                                                bathrooms={property.bathrooms || undefined}
                                                area={property.area_sqft ? `${property.area_sqft} sq.ft` : undefined}
                                                verified={property.verified}
                                                sponsored={true}
                                                userId={property.user_id}
                                                onClick={() => {
                                                    if (property.campaign_id) {
                                                        incrementClicks(property.campaign_id);
                                                    }
                                                    navigate(`/property/${property.id}`);
                                                }}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex -left-4" />
                            <CarouselNext className="hidden md:flex -right-4" />
                        </Carousel>
                    </div>
                )}

                {/* Regular Properties Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size={40} />
                    </div>
                ) : displayedProperties.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 max-w-full">
                            {displayedProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    id={property.id}
                                    image={property.images[0] || '/placeholder.svg'}
                                    title={property.title}
                                    type={propertyTypes.find(t => t.type === property.property_type)?.icon || '🏠'}
                                    propertyType={property.property_type}
                                    price={`₹${property.price.toLocaleString()}`}
                                    priceType={property.price_type}
                                    location={`${property.area}, ${property.city}`}
                                    bedrooms={property.bedrooms || undefined}
                                    bathrooms={property.bathrooms || undefined}
                                    area={property.area_sqft ? `${property.area_sqft} sq.ft` : undefined}
                                    verified={property.verified}
                                    userId={property.user_id}
                                    onClick={() => navigate(`/property/${property.id}`)}
                                />
                            ))}
                        </div>

                        {/* Load More Trigger */}
                        {displayedCount < properties.length && (
                            <div ref={loadMoreRef} className="py-8 text-center flex justify-center">
                                <LoadingSpinner size={24} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-6xl mb-4">{currentType?.icon || '🏠'}</div>
                        <h3 className="text-xl font-semibold mb-2">No {currentType?.label || 'properties'} found</h3>
                        <p className="text-muted-foreground mb-6">
                            Try adjusting your location or check back later.
                        </p>
                        <Button onClick={() => setLocationDialogOpen(true)}>
                            Change Location
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyCategory;
