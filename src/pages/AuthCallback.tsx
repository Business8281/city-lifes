import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const run = async () => {
      try {
        const currentUrl = new URL(window.location.href);
        // Guard: only attempt exchange if ?code= is present
        const hasCode = currentUrl.searchParams.get('code');
        if (!hasCode) {
          navigate('/auth', { replace: true });
          return;
        }
        const { data, error } = await supabase.auth.exchangeCodeForSession(currentUrl.href as unknown as string);
        if (error) throw error;
        if (data?.session) {
          const user = data.session.user;
          const meta = (user.user_metadata as Record<string, any>) || {};

          // Ensure a profile exists and is populated with name/email
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
          } catch (e) {
            // non-blocking
          }

          if (meta?.profile_completed === true) {
            toast({ title: 'Signed in', description: 'Welcome back!' });
            navigate('/', { replace: true });
            return;
          }

          // Check profile completeness (require phone only)
          const { data: profile, error: pErr } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', user.id)
            .single();

          if (pErr) {
            const status = (pErr as any)?.status;
            if (status === 406 || status === 404) {
              navigate('/setup-profile', { replace: true });
              return;
            }
            toast({ title: 'Signed in', description: 'Welcome back!' });
            navigate('/', { replace: true });
            return;
          }

          const needsPhone = !profile?.phone || String(profile.phone).replace(/\D/g,'').length !== 10;
          if (needsPhone) {
            navigate('/setup-profile', { replace: true });
            return;
          }

          toast({ title: 'Signed in', description: 'Welcome back!' });
          navigate('/', { replace: true });
          return;
        }
        navigate('/', { replace: true });
      } catch (err: any) {
        // If there was no code verifier or exchange failed, send back to auth silently unless real error
        const message = err?.message || '';
        if (message.includes('auth code') || message.includes('code verifier')) {
          navigate('/auth', { replace: true });
          return;
        }
        toast({ variant: 'destructive', title: 'Sign-in failed', description: message || 'OAuth error' });
        navigate('/auth', { replace: true });
      }
    };
    run();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted-foreground">Completing sign-in…</div>
    </div>
  );
};

export default AuthCallback;
