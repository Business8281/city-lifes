import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CancellationRefundPolicy = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
            <div className="sticky top-0 z-40 bg-background border-b">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Go back">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <RefreshCcw className="h-5 w-5 text-muted-foreground" />
                            Cancellations and Refunds
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
                <Card>
                    <div className="p-4 text-sm text-muted-foreground space-y-2">
                        <p>
                            This Cancellation and Refund Policy explains how <span className="font-semibold text-foreground">citylifes</span> handles cancellations and refunds for services or products purchased through our platform.
                        </p>
                        <p className="font-medium text-foreground mt-3">Cancellation Policy</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Orders or bookings may be cancelled within a specified timeframe as indicated at the time of purchase.</li>
                            <li>To cancel an order, please visit your account settings or contact support.</li>
                            <li>Some services may be non-cancellable once the service has commenced or the product has been dispatched.</li>
                        </ul>
                        <p className="font-medium text-foreground mt-3">Refund Policy</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Refunds are processed to the original payment method within a reasonable processing time.</li>
                            <li>You may be eligible for a refund if the service provided was not as described or if there was an error in processing your order.</li>
                            <li>Refund requests must be made within the applicable refund period from the date of purchase.</li>
                        </ul>
                        <p className="font-medium text-foreground mt-3">Non-Refundable Items</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Certain items or services are marked as non-refundable. Please check the specific terms before purchase.</li>
                            <li>Digital goods or downloadable content that has been accessed are typically non-refundable.</li>
                        </ul>
                        <p className="font-medium text-foreground mt-3">Contact Us</p>
                        <p>
                            If you have any questions about our Cancellation and Refund Policy, please contact our support team through the app.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CancellationRefundPolicy;
