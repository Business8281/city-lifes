import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Geolocation } from '@capacitor/geolocation';

export type LocationMethod = 'live' | 'city' | 'area' | 'pincode';

interface LocationState {
  method: LocationMethod | null;
  value: string;
  coordinates?: { lat: number; lng: number };
}

interface LocationContextType {
  location: LocationState;
  setLocationMethod: (method: LocationMethod) => void;
  setLocationValue: (value: string) => void;
  setCoordinates: (coords: { lat: number; lng: number }) => void;
  getCurrentLocation: () => Promise<void>;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationState>({
    method: null,
    value: '',
  });

  const setLocationMethod = (method: LocationMethod) => {
    setLocation(prev => ({ ...prev, method }));
  };

  const setLocationValue = (value: string) => {
    setLocation(prev => ({ ...prev, value }));
  };

  const setCoordinates = (coords: { lat: number; lng: number }) => {
    setLocation(prev => ({ ...prev, coordinates: coords }));
  };

  const getCurrentLocation = async () => {
    try {
      // Try Capacitor Geolocation first (for native apps)
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
      
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      
      setLocation({
        method: 'live',
        value: 'Current Location',
        coordinates: coords,
      });
    } catch (capacitorError) {
      // Fallback to browser geolocation for web
      return new Promise<void>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setLocation({
              method: 'live',
              value: 'Current Location',
              coordinates: coords,
            });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    }
  };

  const clearLocation = () => {
    setLocation({
      method: null,
      value: '',
    });
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocationMethod,
        setLocationValue,
        setCoordinates,
        getCurrentLocation,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}
