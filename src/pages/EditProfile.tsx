import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Save, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { profileSchema } from "@/schemas/validationSchemas";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, changeEmail, updatePhone } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
  });

  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailChanging, setEmailChanging] = useState(false);

  const [showPhoneChange, setShowPhoneChange] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [phoneChanging, setPhoneChanging] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setFormData({
            fullName: data.full_name || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    try {
      profileSchema.parse({
        full_name: formData.fullName,
        phone: formData.phone
      });

      setSubmitting(true);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.fullName,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!newEmail || newEmail === user?.email) {
      setError("Please enter a different email address");
      return;
    }

    setEmailChanging(true);
    const { error } = await changeEmail(newEmail);
    setEmailChanging(false);

    if (error) {
      setError(error.message || "Failed to change email");
      toast.error("Failed to change email");
      return;
    }

    toast.success("Verification email sent! Check both email addresses.");
    setShowEmailChange(false);
    setNewEmail("");
  };

  const handlePhoneChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newPhone)) {
      setError("Please enter a valid 10-digit Indian phone number");
      return;
    }

    const phoneWithPrefix = `+91${newPhone}`;
    if (phoneWithPrefix === formData.phone) {
      setError("Please enter a different phone number");
      return;
    }

    setPhoneChanging(true);
    const { error } = await updatePhone(phoneWithPrefix);
    setPhoneChanging(false);

    if (error) {
      setError(error.message || "Failed to update phone number");
      toast.error("Failed to update phone number");
      return;
    }

    toast.success("Phone number updated successfully!");
    setFormData({ ...formData, phone: phoneWithPrefix });
    setShowPhoneChange(false);
    setNewPhone("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Edit Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              <Button type="button" variant="outline" size="sm">
                Change Photo
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </div>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Current Email
                </div>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Current Phone Number
                </div>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || "Not set"}
                disabled
                className="bg-muted"
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              <Save className="h-4 w-4" />
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Security Settings</h2>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Change Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your email address
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowEmailChange(!showEmailChange);
                    setError("");
                  }}
                >
                  {showEmailChange ? "Cancel" : "Change"}
                </Button>
              </div>

              {showEmailChange && (
                <form onSubmit={handleEmailChange} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="newEmail">New Email Address</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      placeholder="newemail@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll receive verification emails to both addresses
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={emailChanging}
                  >
                    {emailChanging ? "Sending Verification..." : "Send Verification Email"}
                  </Button>
                </form>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Change Phone Number</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your phone number
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowPhoneChange(!showPhoneChange);
                    setError("");
                  }}
                >
                  {showPhoneChange ? "Cancel" : "Change"}
                </Button>
              </div>

              {showPhoneChange && (
                <form onSubmit={handlePhoneChange} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="newPhone">New Phone Number</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                        +91
                      </span>
                      <Input
                        id="newPhone"
                        type="tel"
                        placeholder="9876543210"
                        className="pl-12"
                        value={newPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setNewPhone(value);
                        }}
                        maxLength={10}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter 10-digit mobile number (India)
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={phoneChanging}
                  >
                    {phoneChanging ? "Updating..." : "Update Phone Number"}
                  </Button>
                </form>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your password
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/forgot-password")}
                >
                  Change
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default EditProfile;
