import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';

export default function Subscription() {
    const { subscription, plan, usage, loading, isTrial } = useSubscription();
    const navigate = useNavigate();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading subscription...</div>;
    }

    if (!subscription || !plan) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">No Active Subscription</h1>
                <p className="text-muted-foreground mb-8">You are currently on the free tier.</p>
                <Button onClick={() => navigate('/pricing')}>View Plans</Button>
            </div>
        );
    }

    const listingPercentage = plan.listing_limit === -1
        ? 0
        : ((usage?.listings_count || 0) / plan.listing_limit) * 100;

    const boostPercentage = plan.boost_limit === -1
        ? 0
        : ((usage?.boosts_used || 0) / plan.boost_limit) * 100;

    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <h1 className="text-3xl font-bold">My Subscription</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current Plan Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Current Plan: {plan.name}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {subscription.status.toUpperCase()}
                            </span>
                        </CardTitle>
                        <CardDescription>
                            {subscription.cancel_at_period_end ? 'Cancels at end of period' : 'Auto-renews'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Status</p>
                            <p className="text-sm text-muted-foreground capitalize">
                                {subscription?.status}
                                {isTrial && subscription?.trial_end && (
                                    <span className="ml-2 text-green-600 font-semibold">
                                        (Free Trial ends {new Date(subscription.trial_end).toLocaleDateString()})
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Price</span>
                            <span className="font-semibold">₹{plan.price_monthly}/month</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Current Period</span>
                            <span className="font-semibold">
                                {format(new Date(subscription.current_period_start), 'MMM d, yyyy')} - {subscription.current_period_end ? format(new Date(subscription.current_period_end), 'MMM d, yyyy') : 'Forever'}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                        <Button variant="outline" onClick={() => navigate('/pricing')}>Change Plan</Button>
                        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">Cancel Subscription</Button>
                    </CardFooter>
                </Card>

                {/* Usage Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usage & Limits</CardTitle>
                        <CardDescription>Your usage for this billing cycle</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Listings Limit */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Listings</span>
                                <span className="text-muted-foreground">
                                    {usage?.listings_count || 0} / {plan.listing_limit === -1 ? 'Unlimited' : plan.listing_limit}
                                </span>
                            </div>
                            <Progress value={plan.listing_limit === -1 ? 100 : listingPercentage} className="h-2" />
                        </div>

                        {/* Boosts Limit */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Boosts</span>
                                <span className="text-muted-foreground">
                                    {usage?.boosts_used || 0} / {plan.boost_limit === -1 ? 'Unlimited' : plan.boost_limit}
                                </span>
                            </div>
                            <Progress value={plan.boost_limit === -1 ? 100 : boostPercentage} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Features */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Plan Features</CardTitle>
                        <CardDescription>Features included in your {plan.name} plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(plan.features && plan.features.length > 0 ? plan.features : [
                                plan.listing_limit === -1 ? 'Unlimited listings' : `${plan.listing_limit} listings`,
                                plan.priority_lead_access ? 'Priority Leads' : 'Standard Leads',
                                plan.analytics_level === 'basic' ? 'Basic Analytics' : 'Advanced Analytics',
                                plan.team_member_limit > 0 ? `${plan.team_member_limit} Team Members` : 'Single User',
                                plan.boost_limit > 0 ? `${plan.boost_limit === -1 ? 'Unlimited' : plan.boost_limit} Boosts/month` : 'No Boosts',
                            ]).map((feature, i) => (
                                <li key={i} className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
