// Reverse Geocoding Utility for Live Location

export interface GeocodingResult {
  city: string;
  area: string;
  pincode: string;
  formattedAddress: string;
  state: string;
}

/**
 * Reverse geocode using OpenStreetMap Nominatim (free, no API key required)
 * Falls back to Google Maps if available
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodingResult | null> {
  try {
    // Try OpenStreetMap Nominatim first (free)
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'Citylifes App',
      },
    });

    if (!response.ok) {
      throw new Error('Nominatim request failed');
    }

    const data = await response.json();
    
    if (!data.address) {
      return null;
    }

    const address = data.address;
    
    // Extract location information
    const city = 
      address.city || 
      address.town || 
      address.village || 
      address.municipality || 
      address.county || 
      '';
    
    const area = 
      address.suburb || 
      address.neighbourhood || 
      address.hamlet || 
      address.locality || 
      '';
    
    const pincode = address.postcode || '';
    const state = address.state || '';

    return {
      city,
      area,
      pincode,
      state,
      formattedAddress: data.display_name || '',
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    
    // Try Google Maps as fallback if API key is available
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (googleApiKey) {
      try {
        const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`;
        const response = await fetch(googleUrl);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
          const result = data.results[0];
          const addressComponents = result.address_components;

          const getComponent = (type: string) => {
            const component = addressComponents.find((c: any) =>
              c.types.includes(type)
            );
            return component?.long_name || '';
          };

          return {
            city: getComponent('locality') || getComponent('administrative_area_level_2'),
            area: getComponent('sublocality') || getComponent('neighborhood'),
            pincode: getComponent('postal_code'),
            state: getComponent('administrative_area_level_1'),
            formattedAddress: result.formatted_address,
          };
        }
      } catch (googleError) {
        console.error('Google Maps geocoding error:', googleError);
      }
    }

    return null;
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m away`;
  }
  return `${km.toFixed(1)}km away`;
}

/**
 * Cache for geocoding results to avoid repeated API calls
 */
const geocodingCache = new Map<string, GeocodingResult>();

export function getCachedGeocode(lat: number, lng: number): GeocodingResult | null {
  const key = `${lat.toFixed(3)},${lng.toFixed(3)}`; // Round to 3 decimals
  return geocodingCache.get(key) || null;
}

export function cacheGeocode(lat: number, lng: number, result: GeocodingResult): void {
  const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  geocodingCache.set(key, result);
}
