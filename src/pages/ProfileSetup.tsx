import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const normalizePhone = (raw: string) => raw.replace(/\D/g, '').slice(-10);

const ProfileSetup = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isValid = useMemo(() => {
    return fullName.trim().length >= 2 && normalizePhone(phone).length === 10;
  }, [fullName, phone]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: uErr } = await supabase.auth.getUser();
        if (uErr || !user) {
          navigate('/auth', { replace: true });
          return;
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();
        if (profile?.full_name) setFullName(profile.full_name);
        if (profile?.phone) setPhone(String(profile.phone));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || saving) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ variant: 'destructive', title: 'Not signed in' });
        navigate('/auth', { replace: true });
        return;
      }
      const phone10 = normalizePhone(phone);
      const payload: Record<string, any> = {
        id: user.id,
        full_name: fullName.trim(),
        phone: phone10,
        email: user.email,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .eq('id', user.id);
      if (error) throw error;

      // Optionally reflect into user_metadata for convenience
      await supabase.auth.updateUser({
        data: { full_name: payload.full_name, phone: payload.phone, profile_completed: true },
      });

      toast({ title: 'Profile updated', description: 'Welcome to CityLife!' });
      navigate('/', { replace: true });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Save failed', description: err?.message || 'Could not save profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-xl font-semibold mb-2">Setting things up…</h1>
        <p className="text-muted-foreground">Loading your profile details.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Complete your profile</h1>
      <p className="text-sm text-muted-foreground mb-6">Please add your full name and Indian phone number to finish sign up.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Indian phone number</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" inputMode="numeric" />
          <p className="text-xs text-muted-foreground">We store only the last 10 digits. No country code needed.</p>
        </div>
        <Button type="submit" className="w-full" disabled={!isValid || saving}>
          {saving ? 'Saving…' : 'Save and continue'}
        </Button>
      </form>
    </div>
  );
};

export default ProfileSetup;
