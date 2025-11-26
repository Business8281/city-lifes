import { createContext, useContext, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: AuthError | null }>;
  verifyOTP: (email: string, token: string) => Promise<{ error: AuthError | null; data: unknown }>;
  resendOTP: (email: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  verifyPasswordResetOTP: (email: string, token: string, newPassword: string) => Promise<{ error: AuthError | null; data: unknown }>;
  changeEmail: (newEmail: string) => Promise<{ error: AuthError | null }>;
  verifyEmailChangeOTP: (token: string) => Promise<{ error: AuthError | null; data: unknown }>;
  updatePhone: (phone: string) => Promise<{ error: unknown | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener with better error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔐 Auth state changed:', event, session?.user?.id ? 'User logged in' : 'No user');
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session with retry logic for reliability
    const checkSession = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.warn('Session check error:', error);
            if (i === retries - 1) {
              setSession(null);
              setUser(null);
              setLoading(false);
              return;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            continue;
          }

          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
          return;
        } catch (err) {
          console.error('Session check failed:', err);
          if (i === retries - 1) {
            if (mounted) {
              setSession(null);
              setUser(null);
              setLoading(false);
            }
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    // Create user account with email confirmation disabled
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });
    
    return { error };
  };

  const verifyOTP = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });
    return { data, error };
  };

  const resendOTP = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const isNative = Capacitor.isNativePlatform?.() === true;
    
    if (isNative) {
      // For mobile apps, use custom URL scheme for deep linking
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'citylife://auth-callback',
          skipBrowserRedirect: false,
          queryParams: {
            prompt: 'select_account', // Show account picker for multiple accounts
          },
        },
      });
      return { error };
    } else {
      // For web, use standard callback URL
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account', // Show account picker for multiple accounts
          },
        },
      });
      return { error };
    }
  };

  const signOut = async () => {
    // Sign out from Supabase and ensure local state is cleared across platforms
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  const verifyPasswordResetOTP = async (email: string, token: string, newPassword: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });
    
    if (!error && data) {
      // Update password after OTP verification
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { data, error: updateError };
    }
    
    return { data, error };
  };

  const changeEmail = async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });
    return { error };
  };

  const verifyEmailChangeOTP = async (token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email_change',
    });
    return { data, error };
  };

  const updatePhone = async (phone: string) => {
    const { error } = await supabase.auth.updateUser({
      phone,
      data: {
        phone,
      },
    });
    
    // Also update in profiles table
    if (!error && user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      return { error: profileError };
    }
    
    return { error };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      verifyOTP, 
      resendOTP, 
      signInWithGoogle, 
      signOut,
      resetPassword,
      updatePassword,
      verifyPasswordResetOTP,
      changeEmail,
      verifyEmailChangeOTP,
      updatePhone
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
