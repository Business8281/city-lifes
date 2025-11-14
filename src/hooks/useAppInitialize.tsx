import { useEffect } from 'react';
import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { configureSystemBars } from "@/utils/systemBars";
import { supabase } from '@/integrations/supabase/client';

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

        CapacitorApp.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
          try {
            const url = new URL(event.url);
            if (url.protocol === 'citylife:' && url.host === 'auth-callback') {
              // Guard: only process if ?code= param present
              if (!url.searchParams.get('code')) {
                window.location.replace('/auth');
                return;
              }
              const { data, error } = await supabase.auth.exchangeCodeForSession(url.href as unknown as string);
              if (error) throw error;
              if (data?.session) {
                const user = data.session.user as any;
                const meta = user?.user_metadata || {};
                // Upsert name/email into profile on native as well
                try {
                  const fullName = meta.full_name || meta.name || '';
                  const email = user.email || '';
                  await supabase.from('profiles').upsert({
                    id: user.id,
                    email,
                    full_name: fullName,
                    updated_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                  });
                } catch {}

                if (meta.profile_completed === true) {
                  window.location.replace('/');
                  return;
                }

                const { data: profile, error: pErr } = await supabase
                  .from('profiles')
                  .select('phone')
                  .eq('id', user.id)
                  .single();

                if (pErr) {
                  const status = (pErr as any)?.status;
                  if (status === 406 || status === 404) {
                    window.location.replace('/setup-profile');
                    return;
                  }
                  window.location.replace('/');
                  return;
                }

                const needsPhone = !profile?.phone || String(profile.phone).replace(/\D/g,'').length !== 10;
                if (needsPhone) {
                  window.location.replace('/setup-profile');
                  return;
                }

                window.location.replace('/');
              }
            }
          } catch (e) {
            window.location.replace('/auth');
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
