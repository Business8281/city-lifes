import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { configureSystemBars } from "@/utils/systemBars";

export const useAppInitialize = () => {
  useEffect(() => {
    const initializeApp = async () => {
      // Only run on native platforms
      if (!Capacitor.isNativePlatform()) return;

      // Runtime system bar configuration for native platforms.
      configureSystemBars("light");
      try {
        // Configure status bar
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#000000' });
        
        // Hide splash screen after app is ready
        await SplashScreen.hide();

        // Handle app state changes
        CapacitorApp.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active:', isActive);
        });

        // Handle back button on Android
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            CapacitorApp.exitApp();
          } else {
            window.history.back();
          }
        });
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();

    // Cleanup listeners on unmount
    return () => {
      if (Capacitor.isNativePlatform()) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, []);
};
