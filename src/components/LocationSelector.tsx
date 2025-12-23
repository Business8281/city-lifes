import { useState } from 'react';
import { MapPin, Navigation, Building, MapPinned, Hash, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useLocation, LocationMethod } from '@/contexts/LocationContext';
import { toast } from 'sonner';
import { allCities, areas, pinCodes } from '@/data/indianLocations';
import { cn } from '@/lib/utils';

interface LocationSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LocationSelector = ({ open, onOpenChange }: LocationSelectorProps) => {
  const { setLocationMethod, setLocationValue, getCurrentLocation, location } = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<LocationMethod | null>(location.method);
  const [inputValue, setInputValue] = useState(location.value);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const handleLiveLocation = async () => {
    try {
      await getCurrentLocation();
      toast.success('Location detected successfully');
      onOpenChange(false);
    } catch {
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
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${selectedMethod === method.id
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
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between"
                    onClick={() => setComboboxOpen(true)}
                  >
                    {inputValue || `Select ${selectedMethod}...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0 bg-background border shadow-md z-50"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <Command shouldFilter={true}>
                    <CommandInput
                      placeholder={`Type to search ${selectedMethod}...`}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No {selectedMethod} found.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {selectedMethod === 'city' && allCities.map((city) => (
                          <CommandItem
                            key={city}
                            value={city}
                            onSelect={(currentValue) => {
                              setInputValue(currentValue);
                              setComboboxOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                inputValue === city ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {city}
                          </CommandItem>
                        ))}
                        {selectedMethod === 'area' && areas.map((area) => (
                          <CommandItem
                            key={area}
                            value={area}
                            onSelect={(currentValue) => {
                              setInputValue(currentValue);
                              setComboboxOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                inputValue === area ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {area}
                          </CommandItem>
                        ))}
                        {selectedMethod === 'pincode' && pinCodes.map((pincode) => (
                          <CommandItem
                            key={pincode}
                            value={pincode}
                            onSelect={(currentValue) => {
                              setInputValue(currentValue);
                              setComboboxOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                inputValue === pincode ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {pincode}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
