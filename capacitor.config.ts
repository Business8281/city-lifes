import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2e849b3d19e54563af8215ad125ce954',
  appName: 'urban-link-pad-80436',
  webDir: 'dist',
  server: {
    url: 'https://2e849b3d-19e5-4563-af82-15ad125ce954.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      // iOS requires location permissions
      permissions: ['location']
    }
  }
};

export default config;
