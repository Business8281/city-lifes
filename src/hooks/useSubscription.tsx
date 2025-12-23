import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Subscription, Plan, Usage } from '@/types/database';

export function useSubscription() {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [usage, setUsage] = useState<Usage | null>(null);
    const [loading, setLoading] = useState(true);

    const [isBypassed, setIsBypassed] = useState(false);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                // 1. Check Roles
                const { data: hasAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
                 
                const { data: hasManager } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'manager' as any });
                const isAdminOrManager = hasAdmin || hasManager;

                if (isAdminOrManager) {
                    setIsBypassed(true);
                }

                // 2. Fetch Subscription
                const { data: subData, error: subError } = await supabase
                    .from('subscriptions')
                    .select('*, plans(*)')
                    .eq('user_id', user.id)
                    .single();

                if (subError && subError.code !== 'PGRST116') {
                    console.error('Error fetching subscription:', subError);
                }

                if (subData) {
                    setSubscription(subData as unknown as Subscription);
                     
                    setPlan((subData as any).plans as Plan);
                }

                // 3. Override for Admin/Manager if needed
                if (isAdminOrManager && (!subData || ((subData as any).plans as Plan)?.name !== 'Business')) {
                    // Fetch Business Plan details to display correct features
                    const { data: businessPlanData } = await supabase
                        .from('plans')
                        .select('*')
                        .eq('name', 'Business')
                        .single();

                    const businessPlan = businessPlanData as unknown as Plan;

                    if (businessPlan) {
                        setPlan(businessPlan);
                        setSubscription({
                            id: 'admin-bypass',
                            user_id: user.id,
                            plan_id: businessPlan.id,
                            razorpay_subscription_id: 'admin-bypass',
                            status: 'active',
                            current_period_start: new Date().toISOString(),
                            current_period_end: null,
                            cancel_at_period_end: false,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            trial_end: null,
                            plans: businessPlan
                        });
                    }
                }

                // 4. Fetch usage data
                const { data: usageData, error: usageError } = await supabase
                    .from('usage')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (usageError && usageError.code !== 'PGRST116') {
                    console.error('Error fetching usage:', usageError);
                }

                if (usageData) {
                    setUsage(usageData);
                }

            } catch (error) {
                console.error('Error in useSubscription:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    const checkLimit = (limitType: 'listings' | 'boosts') => {
        if (isBypassed) return true; // Bypass all limits for admin/manager

        // Check for active trial
        const isTrialActive = subscription?.trial_end && new Date(subscription.trial_end) > new Date();

        // If in trial, grant full access (Business plan equivalent)
        if (isTrialActive) return true;

        if (!plan || !usage) return false; // Default to restrictive if no data

        if (limitType === 'listings') {
            if (plan.listing_limit === -1) return true; // Unlimited
            return usage.listings_count < plan.listing_limit;
        }

        if (limitType === 'boosts') {
            if (plan.boost_limit === -1) return true; // Unlimited
            return usage.boosts_used < plan.boost_limit;
        }

        return false;
    };

    const isTrialActive = subscription?.trial_end && new Date(subscription.trial_end) > new Date();

    return {
        subscription,
        plan,
        usage,
        loading,
        checkLimit,
        isPro: isBypassed || isTrialActive || plan?.analytics_level === 'pro' || plan?.analytics_level === 'business',
        isBusiness: isBypassed || isTrialActive || plan?.analytics_level === 'business',
        isTrial: isTrialActive
    };
}
