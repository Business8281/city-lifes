import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Ban } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileStatus {
    is_banned?: boolean | null;
    suspended_until?: string | null;
}

export function UserStatusAlert() {
    const { user } = useAuth();
    const [status, setStatus] = useState<{
        isBanned: boolean;
        suspendedUntil: string | null;
    } | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchStatus = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                // Cast to handle columns that may not be in TypeScript types yet
                const profileData = data as unknown as ProfileStatus;
                setStatus({
                    isBanned: profileData.is_banned ?? false,
                    suspendedUntil: profileData.suspended_until ?? null,
                });
            }
        };

        fetchStatus();

        const channel = supabase
            .channel('profile-status-changes')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${user.id}`
            }, (payload) => {
                const newData = payload.new as ProfileStatus;
                setStatus({
                    isBanned: newData.is_banned ?? false,
                    suspendedUntil: newData.suspended_until ?? null,
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    if (!status) return null;

    if (status.isBanned) {
        return (
            <Alert variant="destructive" className="mx-4 mt-4 border-2 border-red-600 bg-red-50">
                <Ban className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">Account Banned</AlertTitle>
                <AlertDescription className="text-base font-medium">
                    Your account has been permanently banned. You cannot perform any actions.
                </AlertDescription>
            </Alert>
        );
    }

    if (status.suspendedUntil && new Date(status.suspendedUntil) > new Date()) {
        return (
            <Alert variant="destructive" className="mx-4 mt-4 border-2 border-orange-500 bg-orange-50">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">Account Suspended</AlertTitle>
                <AlertDescription className="text-base font-medium">
                    Your account is suspended until {new Date(status.suspendedUntil).toLocaleDateString()} at {new Date(status.suspendedUntil).toLocaleTimeString()}.
                    You cannot perform any actions during this time.
                </AlertDescription>
            </Alert>
        );
    }

    return null;
}