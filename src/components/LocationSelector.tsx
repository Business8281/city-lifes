import { useState } from 'react';
import { MapPin, Navigation, Building, MapPinned, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useLocation, LocationMethod } from '@/contexts/LocationContext';
import { toast } from 'sonner';

interface LocationSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LocationSelector = ({ open, onOpenChange }: LocationSelectorProps) => {
  const { setLocationMethod, setLocationValue, getCurrentLocation, location } = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<LocationMethod | null>(location.method);
  const [inputValue, setInputValue] = useState(location.value);

  const handleLiveLocation = async () => {
    try {
      await getCurrentLocation();
      toast.success('Location detected successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to get your location. Please enable location services.');
    }
  };

  const handleSubmit = () => {
    if (!selectedMethod) {
      toast.error('Please select a location method');
      return;
    }
    if (!inputValue.trim() && selectedMethod !== 'live') {
      toast.error('Please enter a location');
      return;
    }

    setLocationMethod(selectedMethod);
    setLocationValue(inputValue);
    toast.success(`Location set to: ${inputValue}`);
    onOpenChange(false);
  };

  const locationMethods = [
    {
      id: 'live' as LocationMethod,
      icon: Navigation,
      label: 'Live Location',
      description: 'Use your current location',
    },
    {
      id: 'city' as LocationMethod,
      icon: Building,
      label: 'City',
      description: 'Search by city name',
    },
    {
      id: 'area' as LocationMethod,
      icon: MapPinned,
      label: 'Area',
      description: 'Search by specific area',
    },
    {
      id: 'pincode' as LocationMethod,
      icon: Hash,
      label: 'Pin Code',
      description: 'Search by postal code',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Select Location Method
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {locationMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    if (method.id === 'live') {
                      handleLiveLocation();
                    }
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{method.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {method.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedMethod && selectedMethod !== 'live' && (
            <div className="space-y-3">
              <Input
                placeholder={`Enter ${selectedMethod}...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full"
              />
              <Button onClick={handleSubmit} className="w-full">
                Set Location
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;
