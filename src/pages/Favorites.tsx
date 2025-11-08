import { useNavigate } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { propertyTypes } from "@/data/properties";

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, loading } = useFavorites(user?.id);


  const favoriteProperties = favorites
    .map(f => f.properties)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
      <div className="max-w-7xl mx-auto px-4 py-6 overflow-x-hidden">
        <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-muted-foreground">Loading favorites...</div>
          </div>
        ) : favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-full">
            {favoriteProperties.map((property: any) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={property.images[0] || '/placeholder.svg'}
                title={property.title}
                type={propertyTypes.find(t => t.type === property.type)?.icon || '🏠'}
                price={`₹${property.price.toLocaleString()}`}
                location={property.location}
                bedrooms={property.bedrooms || undefined}
                bathrooms={property.bathrooms || undefined}
                area={property.area ? `${property.area} sq.ft` : undefined}
                verified={property.status === 'active'}
                onClick={() => navigate(`/property/${property.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">💙</div>
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring and save properties you love
            </p>
            <Button onClick={() => navigate("/")}>Browse Properties</Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Favorites;
