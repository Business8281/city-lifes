import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ContactPolicy = () => {
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
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            Contact Us
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
                <Card>
                    <div className="p-4 text-sm text-muted-foreground space-y-2">
                        <p>
                            We are here to help! If you have any questions, concerns, or feedback about <span className="font-semibold text-foreground">citylifes</span>, please reach out to us.
                        </p>
                        <p className="font-medium text-foreground mt-3">Customer Support</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>For general inquiries and support, you can use the "Help & Support" feature in the Settings menu to submit a ticket.</li>
                            <li>Our team strives to respond to all inquiries within 24-48 hours.</li>
                        </ul>
                        <p className="font-medium text-foreground mt-3">Business Inquiries</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>For partnerships, media, or other business-related inquiries, please contact our business team via the official channels designated in the app or website.</li>
                        </ul>
                        <p className="font-medium text-foreground mt-3">Mailing Address</p>
                        <p>
                            Please refer to our official website for our physical mailing address if needed for legal correspondence.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ContactPolicy;
