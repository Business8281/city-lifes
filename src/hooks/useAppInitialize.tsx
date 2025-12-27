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
        CapacitorApp.addListener('appStateChange', ({ isActive: _isActive }) => {

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
            // Handle citylife:// deep link for OAuth callback
            if (event.url.startsWith('citylife://auth-callback')) {


              // Parse URL to extract code and error parameters
              const url = new URL(event.url.replace('citylife://', 'https://'));
              const code = url.searchParams.get('code');
              const error = url.searchParams.get('error');
              const errorDescription = url.searchParams.get('error_description');

              // Handle OAuth errors
              if (error) {
                console.error('[AppUrlOpen] OAuth error:', error, errorDescription);
                window.location.replace('/auth');
                return;
              }

              // Guard: only process if code is present
              if (!code) {

                window.location.replace('/auth');
                return;
              }



              // Exchange code for session using the full callback URL
              const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(event.url);

              if (exchangeError) {
                console.error('[AppUrlOpen] Code exchange error:', exchangeError);
                window.location.replace('/auth');
                return;
              }

              if (data?.session) {

                const user = data.session.user;
                const meta = (user.user_metadata as Record<string, any>) || {};

                // Upsert name/email into profile for Google OAuth users
                try {
                  const fullName = meta.full_name || meta.name || '';
                  const email = user.email || '';

                  await supabase.from('profiles').upsert({
                    id: user.id,
                    email,
                    full_name: fullName,
                    updated_at: new Date().toISOString(),
                  }, {
                    onConflict: 'id'
                  });


                } catch (profileError) {
                  console.error('[AppUrlOpen] Profile upsert error:', profileError);
                }

                // Check if profile is already completed
                if (meta.profile_completed === true) {

                  window.location.replace('/');
                  return;
                }

                // Check if user needs to complete phone number setup
                const { data: profile, error: pErr } = await supabase
                  .from('profiles')
                  .select('phone, full_name')
                  .eq('id', user.id)
                  .single();

                if (pErr) {
                  console.error('[AppUrlOpen] Profile fetch error:', pErr);
                  const status = (pErr as any)?.status;
                  if (status === 406 || status === 404) {

                    window.location.replace('/setup-profile');
                    return;
                  }
                  window.location.replace('/');
                  return;
                }

                const needsPhone = !profile?.phone || String(profile.phone).replace(/\D/g, '').length !== 10;
                const needsName = !profile?.full_name || profile.full_name.trim() === '';

                if (needsPhone || needsName) {

                  window.location.replace('/setup-profile');
                  return;
                }

                // Mark profile as completed
                await supabase.auth.updateUser({
                  data: { profile_completed: true }
                });


                window.location.replace('/');
              } else {

                window.location.replace('/auth');
              }
            }
          } catch (e) {
            console.error('[AppUrlOpen] Error handling callback:', e);
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
