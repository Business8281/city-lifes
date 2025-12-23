import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Plan } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

export default function Pricing() {
    const { user } = useAuth();
    const { plan: currentPlan } = useSubscription();
    const navigate = useNavigate();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        const fetchPlans = async () => {
            const { data, error } = await supabase
                .from('plans')
                .select('*')
                .order('price_monthly', { ascending: true });

            if (error) {
                console.error('Error fetching plans:', error);
                toast.error('Failed to load plans');
            } else {
                setPlans(data || []);
            }
            setLoading(false);
        };

        fetchPlans();
    }, []);

    const handleSubscribe = async (plan: Plan) => {
        if (!user) {
            navigate('/auth');
            return;
        }

        if (currentPlan?.id === plan.id) {
            toast.info('You are already subscribed to this plan');
            return;
        }

        // Check if user is eligible for trial (no previous subscriptions)
        const { data: existingSubs } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', user.id);

        const isTrialEligible = !existingSubs || existingSubs.length === 0;

        if (isTrialEligible) {
            // Start 1 Month Free Trial
            const trialEndDate = new Date();
            trialEndDate.setMonth(trialEndDate.getMonth() + 1);

            const { error } = await supabase
                 
                .from('subscriptions' as any)
                .insert({
                    user_id: user.id,
                    plan_id: plan.id,
                    status: 'active',
                    trial_end: trialEndDate.toISOString(),
                    current_period_start: new Date().toISOString(),
                    cancel_at_period_end: false
                });

            if (error) {
                console.error('Error starting trial:', error);
                toast.error('Failed to start trial');
            } else {
                toast.success('1 Month Free Trial Started!');
                navigate('/dashboard');
                // Force reload to update subscription state
                window.location.reload();
            }
            return;
        }

        // TODO: Integrate Razorpay here
        toast.info('Payment integration coming soon!');
        console.log('Subscribe to:', plan.name, billingCycle);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading plans...</div>;
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
                <p className="text-muted-foreground text-lg mb-8">Choose the plan that's right for your business</p>

                <div className="flex justify-center items-center space-x-4 mb-8">
                    <Button
                        variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        Monthly
                    </Button>
                    <Button
                        variant={billingCycle === 'yearly' ? 'default' : 'outline'}
                        onClick={() => setBillingCycle('yearly')}
                    >
                        Yearly (Save 17%)
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <Card key={plan.id} className={`flex flex-col ${plan.name === 'Pro' ? 'border-primary shadow-lg scale-105' : ''}`}>
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>
                                {plan.name === 'Basic' && 'For individuals starting out'}
                                {plan.name === 'Pro' && 'For growing agents and owners'}
                                {plan.name === 'Business' && 'For teams and agencies'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="mb-6">
                                <span className="text-4xl font-bold">
                                    ₹{billingCycle === 'monthly' ? plan.price_monthly : Math.round(plan.price_yearly / 12)}
                                </span>
                                <span className="text-muted-foreground">/month</span>
                                {billingCycle === 'yearly' && (
                                    <div className="text-sm text-green-600 mt-1">Billed ₹{plan.price_yearly} yearly</div>
                                )}
                            </div>

                            <ul className="space-y-3">
                                {/* Parse features from JSON or use defaults based on plan name if JSON is empty/invalid */}
                                {(plan.features && plan.features.length > 0 ? plan.features : [
                                    plan.listing_limit === -1 ? 'Unlimited listings' : `${plan.listing_limit} listings`,
                                    plan.priority_lead_access ? 'Priority Leads' : 'Standard Leads',
                                    plan.analytics_level === 'basic' ? 'Basic Analytics' : 'Advanced Analytics',
                                    plan.team_member_limit > 0 ? `${plan.team_member_limit} Team Members` : 'Single User',
                                    plan.boost_limit > 0 ? `${plan.boost_limit === -1 ? 'Unlimited' : plan.boost_limit} Boosts/month` : 'No Boosts',
                                ]).map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={plan.name === 'Pro' ? 'default' : 'outline'}
                                onClick={() => handleSubscribe(plan)}
                                disabled={currentPlan?.id === plan.id}
                            >
                                {currentPlan?.id === plan.id ? 'Current Plan' : 'Start 1 Month Free Trial'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
