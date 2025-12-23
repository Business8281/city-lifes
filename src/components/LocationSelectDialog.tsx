
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Navigation, Building2, MapPin, Hash, Loader2 } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface LocationSelectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLocationSelect: (type: 'live' | 'city' | 'area' | 'pincode', value: string, coords?: { lat: number; lng: number }) => void;
}

export function LocationSelectDialog({ open, onOpenChange, onLocationSelect }: LocationSelectDialogProps) {
    const { getCurrentLocation } = useLocation();
    const [selectedMethod, setSelectedMethod] = useState<'live' | 'city' | 'area' | 'pincode' | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLiveLocation = async () => {
        setIsLoading(true);
        try {
            await getCurrentLocation();
            // Wait for location update in context or just close? 
            // Actually getCurrentLocation updates the context.
            // We might need to get the coords back if possible or rely on context.
            // For now, let's assume successful trigger.
            onLocationSelect('live', 'Current Location');
            onOpenChange(false);
            toast.success("Location updated successfully");
        } catch (error: any) {
            console.error("Location error:", error);
            toast.error(error.message || "Failed to get current location");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        if (selectedMethod && inputValue.trim()) {
            onLocationSelect(selectedMethod, inputValue.trim());
            onOpenChange(false);
            setSelectedMethod(null);
            setInputValue("");
        } else if (!inputValue.trim()) {
            toast.error("Please enter a value to search");
        }
    };

    const renderInput = () => {
        if (!selectedMethod || selectedMethod === 'live') return null;

        let placeholder = "";
        if (selectedMethod === 'city') placeholder = "Enter city name (e.g. Hyderabad)";
        if (selectedMethod === 'area') placeholder = "Enter area name (e.g. Gachibowli)";
        if (selectedMethod === 'pincode') placeholder = "Enter 6-digit PIN code";

        return (
            <div className="space-y-4 pt-4 animate-in slide-in-from-bottom-2">
                <Input
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="h-12"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <Button onClick={handleSubmit} className="w-full h-12 text-lg">
                    Search
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => { setSelectedMethod(null); setInputValue(""); }}
                    className="w-full"
                >
                    Back to options
                </Button>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5" /> Select Location Method
                    </DialogTitle>
                </DialogHeader>

                {!selectedMethod ? (
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <Button
                            variant="outline"
                            className="h-32 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all relative"
                            onClick={handleLiveLocation}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                            ) : (
                                <Navigation className="h-8 w-8 text-blue-500" />
                            )}
                            <div className="text-center">
                                <div className="font-semibold text-base">{isLoading ? 'Locating...' : 'Live Location'}</div>
                                <div className="text-xs text-muted-foreground font-normal mt-1">Use your current location</div>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-32 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all"
                            onClick={() => setSelectedMethod('city')}
                        >
                            <Building2 className="h-8 w-8 text-orange-500" />
                            <div className="text-center">
                                <div className="font-semibold text-base">City</div>
                                <div className="text-xs text-muted-foreground font-normal mt-1">Search by city name</div>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-32 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all"
                            onClick={() => setSelectedMethod('area')}
                        >
                            <MapPin className="h-8 w-8 text-green-500" />
                            <div className="text-center">
                                <div className="font-semibold text-base">Area</div>
                                <div className="text-xs text-muted-foreground font-normal mt-1">Search by specific area</div>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-32 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all"
                            onClick={() => setSelectedMethod('pincode')}
                        >
                            <Hash className="h-8 w-8 text-purple-500" />
                            <div className="text-center">
                                <div className="font-semibold text-base">Pin Code</div>
                                <div className="text-xs text-muted-foreground font-normal mt-1">Search by postal code</div>
                            </div>
                        </Button>
                    </div>
                ) : (
                    renderInput()
                )}
            </DialogContent>
        </Dialog>
    );
}
