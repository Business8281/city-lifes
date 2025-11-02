import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import BottomNav from "@/components/BottomNav";
import { sampleProperties } from "@/data/properties";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  const favoriteProperties = sampleProperties.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={property.images[0]}
                title={property.title}
                type={property.icon}
                price={property.price}
                location={property.location}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                verified={property.verified}
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
