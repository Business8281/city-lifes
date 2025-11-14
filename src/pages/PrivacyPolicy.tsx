import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PrivacyPolicy = () => {
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
              <Shield className="h-5 w-5 text-muted-foreground" />
              Privacy Policy
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
        <Card>
          <div className="p-4 text-sm text-muted-foreground space-y-2">
            <p className="text-foreground font-medium">Effective Date: November 13, 2025</p>
            <p>
              This Privacy Policy explains how <span className="font-semibold text-foreground">citylifes</span> collects, uses, and protects your information when you use our website, mobile apps, and services (collectively, the "Services"). By using the Services, you agree to the terms outlined here.
            </p>
            <p className="font-medium text-foreground mt-3">Information We Collect</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account data such as name, email, phone, and profile details you provide.</li>
              <li>Location information when you allow access to location features.</li>
              <li>Usage data like device identifiers, pages viewed, and interactions to improve the experience.</li>
              <li>Content you create or submit, including listings, messages, and favorites.</li>
            </ul>
            <p className="font-medium text-foreground mt-3">How We Use Information</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To operate and improve <span className="font-semibold text-foreground">citylifes</span>, personalize content, and provide customer support.</li>
              <li>To enable core features such as property listings, messaging, and notifications.</li>
              <li>To maintain safety, prevent fraud, and comply with legal obligations.</li>
            </ul>
            <p className="font-medium text-foreground mt-3">Sharing</p>
            <p>
              We do not sell your personal information. We may share information with service providers who help run <span className="font-semibold text-foreground">citylifes</span>, with your consent, or when required by law.
            </p>
            <p className="font-medium text-foreground mt-3">Data Security</p>
            <p>
              We use industry-standard security measures to protect your data. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p className="font-medium text-foreground mt-3">Data Retention</p>
            <p>
              We retain personal data only as long as necessary to provide the Services and for legitimate business or legal purposes.
            </p>
            <p className="font-medium text-foreground mt-3">Your Choices</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Update profile details in your account.</li>
              <li>Manage location permissions in your device settings.</li>
              <li>Request access or deletion of your data where applicable.</li>
            </ul>
            <p className="font-medium text-foreground mt-3">Changes and Contact</p>
            <p>
              We may update this policy from time to time. Your continued use of <span className="font-semibold text-foreground">citylifes</span> means you accept the updated policy. For questions, please use the contact options in the app.
            </p>
          </div>
        </Card>
      </div>

      
    </div>
  );
};

export default PrivacyPolicy;
