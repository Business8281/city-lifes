import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.citylifes.app',
  appName: 'Citylifes',
  webDir: 'dist',
  // Uncomment the server config below for live reload during development
  // server: {
  //   url: 'https://2e849b3d-19e5-4563-af82-15ad125ce954.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    Geolocation: {
      // iOS requires location permissions
      permissions: ['location']
    },
    StatusBar: {
      style: 'DARK',
      overlays: true,
      backgroundColor: '#00000000'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
