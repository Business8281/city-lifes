import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useAdminCheck() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Method 1: Try has_role function (preferred)
        const { data: hasAdmin, error: roleErr } = await supabase
          .rpc('has_role', { _user_id: user.id, _role: 'admin' });

        if (!roleErr && hasAdmin !== null) {
          console.debug('Admin check via has_role:', hasAdmin);
          setIsAdmin(Boolean(hasAdmin));
          setLoading(false);
          return;
        }

        console.debug('has_role failed, trying direct user_roles query:', roleErr);

        // Method 2: Fallback to direct user_roles select
        const { data: roleData, error: selectErr } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!selectErr && roleData) {
          console.debug('Admin check via user_roles select:', roleData.role === 'admin');
          setIsAdmin(roleData.role === 'admin');
          setLoading(false);
          return;
        }

        console.debug('user_roles select failed, trying get_user_role:', selectErr);

        // Method 3: Final fallback to get_user_role
        const { data: userRole, error: getUserErr } = await supabase
          .rpc('get_user_role', { _user_id: user.id });

        if (!getUserErr) {
          console.debug('Admin check via get_user_role:', userRole === 'admin');
          setIsAdmin(userRole === 'admin');
        } else {
          console.error('All admin check methods failed:', getUserErr);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
}
