import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const MapView = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="flex items-center justify-center h-[calc(100vh-5rem)] px-4">
        <div className="text-center max-w-md">
          <MapPin className="h-20 w-20 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Map View Coming Soon</h2>
          <p className="text-muted-foreground mb-6">
            We're working on bringing you an interactive map view to explore properties near you.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default MapView;
