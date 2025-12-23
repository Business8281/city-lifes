/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react';
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
    } catch (error: any) {
      console.warn('Capacitor geolocation failed:', error);

      // Fallback to browser geolocation for web
      return new Promise<void>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser'));
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
          (webError) => {
            let errorMessage = 'Failed to get location';
            switch (webError.code) {
              case 1: // PERMISSION_DENIED
                errorMessage = 'Location permission denied. Please enable it in your browser settings.';
                break;
              case 2: // POSITION_UNAVAILABLE
                errorMessage = 'Location information is unavailable.';
                break;
              case 3: // TIMEOUT
                errorMessage = 'Request to get user location timed out.';
                break;
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
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
