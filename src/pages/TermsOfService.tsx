import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const TermsOfService = () => {
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
              <FileText className="h-5 w-5 text-muted-foreground" />
              Terms of Services
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
        <Card>
          <div className="p-4 text-sm text-muted-foreground space-y-2">
            <p>
              These Terms ("Terms") govern your access to and use of <span className="font-semibold text-foreground">citylifes</span>. By using citylifes, you agree to be bound by these Terms.
            </p>
            <p className="font-medium text-foreground mt-3">Use of Services</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You must be at least the age of majority in your jurisdiction to use citylifes.</li>
              <li>You are responsible for the accuracy of information you provide and the content you post.</li>
              <li>Do not misuse the Services, including spam, fraud, or unlawful activity.</li>
            </ul>
            <p className="font-medium text-foreground mt-3">Listings and Content</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-semibold text-foreground">citylifes</span> may moderate listings or content that violates these Terms or applicable law.</li>
              <li>You grant <span className="font-semibold text-foreground">citylifes</span> a limited license to host and display content you submit for the purpose of operating the Services.</li>
            </ul>
            <p className="font-medium text-foreground mt-3">Accounts</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maintain the security of your account. You are responsible for activity under your account.</li>
              <li>We may suspend or terminate access for violations of these Terms or suspected abuse.</li>
            </ul>
            <p className="font-medium text-foreground mt-3">Payments and Fees</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Some features may be paid. Prices, taxes, and billing terms will be disclosed where applicable.</li>
              <li>By purchasing, you authorize charges according to the payment method you provide.</li>
            </ul>
            <p className="font-medium text-foreground mt-3">Disclaimers and Liability</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Services are provided "as is" without warranties of any kind.</li>
              <li>To the maximum extent permitted by law, <span className="font-semibold text-foreground">citylifes</span> is not liable for indirect, incidental, or consequential damages.</li>
            </ul>
            <p className="font-medium text-foreground mt-3">Governing Law</p>
            <p>
              These Terms will be governed by applicable laws in your jurisdiction unless otherwise required by law.
            </p>
            <p className="font-medium text-foreground mt-3">Changes to Terms</p>
            <p>
              We may update these Terms. Continued use of <span className="font-semibold text-foreground">citylifes</span> after changes means you accept the updated Terms.
            </p>
            <p className="font-medium text-foreground mt-3">Contact</p>
            <p>
              For support or questions about these Terms, please contact us via the app.
            </p>
          </div>
        </Card>
      </div>

      
    </div>
  );
};

export default TermsOfService;
