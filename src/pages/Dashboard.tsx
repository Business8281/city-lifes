import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Users, FileText, Eye, MessageSquare, Heart, TrendingUp, ShieldAlert, UserPlus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lead } from '@/types/database';
import { format } from 'date-fns';

interface DashboardStats {
    active_listings: number;
    total_views: number;
    new_leads: number;
    favorites: number;
    unread_messages: number;
}

export default function Dashboard() {
    const { user } = useAuth();
    const { isAdmin } = useAdminCheck();
    const { isPro, isBusiness } = useSubscription();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        if (!user) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await supabase.rpc('get_dashboard_stats' as any, { user_id: user.id });
            if (error) throw error;
            setStats(data as unknown as DashboardStats);

            // Fetch recent leads for owners
            if (isPro || isBusiness || isAdmin) {
                const { data: leadsData, error: leadsError } = await supabase
                    .from('leads' as any)
                    .select('*, profiles(full_name, email)')
                    .eq('owner_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (!leadsError) {
                    setRecentLeads(leadsData as unknown as Lead[]);
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            toast.error('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();

        if (!user) return;

        // Realtime subscriptions
        const channels = [
            supabase.channel('dashboard-leads')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'leads', filter: `owner_id=eq.${user.id}` }, () => {
                    fetchStats();
                    toast.info('New lead activity!');
                })
                .subscribe(),
            supabase.channel('dashboard-messages')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, () => {
                    fetchStats();
                    toast.info('New message received');
                })
                .subscribe(),
            supabase.channel('dashboard-properties')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'properties', filter: `user_id=eq.${user.id}` }, () => {
                    fetchStats();
                })
                .subscribe()
        ];

        return () => {
            channels.forEach(channel => supabase.removeChannel(channel));
        };
    }, [user, isPro, isBusiness, isAdmin]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
    }

    const isOwner = isPro || isBusiness || stats?.active_listings > 0;

    return (
        <DashboardLayout
            title={`Welcome back, ${user?.user_metadata?.full_name || 'User'}`}
            actions={
                <Button onClick={() => navigate('/add-property')}>Add New Property</Button>
            }
        >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats for Owners/Agents */}
                {isOwner && (
                    <>
                        <StatCard
                            title="Active Listings"
                            value={stats?.active_listings || 0}
                            icon={FileText}
                            description="Properties currently live"
                        />
                        <StatCard
                            title="Total Views"
                            value={stats?.total_views || 0}
                            icon={Eye}
                            description="Across all listings"
                            trend={{ value: 12, label: "this week", positive: true }}
                        />
                        <StatCard
                            title="New Leads"
                            value={stats?.new_leads || 0}
                            icon={UserPlus}
                            description="Potential clients"
                            trend={{ value: 5, label: "this week", positive: true }}
                        />
                    </>
                )}

                {/* Stats for Regular Users */}
                {!isOwner && !isAdmin && (
                    <>
                        <StatCard
                            title="Favorites"
                            value={stats?.favorites || 0}
                            icon={Heart}
                            description="Properties saved"
                        />
                        <StatCard
                            title="Unread Messages"
                            value={stats?.unread_messages || 0}
                            icon={MessageSquare}
                            description="Messages waiting for reply"
                        />
                    </>
                )}

                {/* Admin Stats */}
                {isAdmin && (
                    <>
                        <StatCard
                            title="Total Users"
                            value={1234} // Placeholder
                            icon={Users}
                            description="Registered users"
                            className="border-blue-200 bg-blue-50"
                        />
                        <StatCard
                            title="Pending Reports"
                            value={5} // Placeholder
                            icon={ShieldAlert}
                            description="Requires moderation"
                            className="border-red-200 bg-red-50"
                        />
                    </>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Content Area */}
                <div className="col-span-4">
                    {isOwner ? (
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Performance Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
                                    Analytics Chart Component Coming Soon
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Recommended Properties</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    Personalized recommendations will appear here.
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Side Widgets */}
                <div className="col-span-3 space-y-4">
                    {/* Recent Leads for Owners */}
                    {isOwner && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserPlus className="h-5 w-5" />
                                    Recent Leads
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentLeads.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentLeads.map((lead) => (
                                            <div key={lead.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                                <div>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <p className="font-medium">{(lead.profiles as any)?.full_name || 'Anonymous'}</p>
                                                    <p className="text-xs text-muted-foreground">{lead.status}</p>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {format(new Date(lead.created_at), 'MMM d')}
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="outline" className="w-full" onClick={() => navigate('/leads')}>View All Leads</Button>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground text-center py-4">
                                        No new leads yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Activity for Everyone */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Recent Messages
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground text-center py-4">
                                No new messages.
                            </div>
                            <Button variant="outline" className="w-full" onClick={() => navigate('/messages')}>Go to Inbox</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
