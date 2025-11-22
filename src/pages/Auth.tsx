import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import citylifesLogo from "@/assets/citylifes-logo-optimized.webp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authSchema } from "@/schemas/validationSchemas";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, verifyOTP, resendOTP, user, loading: authLoading, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    confirmPassword: "",
  });

  // Redirect if already logged in (email login) -> home
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const getErrorMessage = (error: unknown): string => {
    const message = (error as { message?: string })?.message || "";
    if (message.includes("Invalid login credentials")) return "Invalid email or password. Please check your credentials and try again.";
    if (message.includes("Email not confirmed")) return "Please verify your email address. Check your inbox for the verification link.";
    if (message.includes("User already registered")) return "This email is already registered. Please login instead.";
    if (message.includes("Password should be at least 6 characters")) return "Password must be at least 6 characters long.";
    if (message.includes("Unable to validate email address")) return "Please enter a valid email address.";
    if (message.includes("Signups not allowed")) return "Signups are currently disabled. Please contact support.";
    return message || "An unexpected error occurred. Please try again.";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      authSchema.parse({ email: loginData.email, password: loginData.password });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const firstError = validationError.errors[0];
        setError(firstError.message);
        setLoading(false);
        return;
      }
    }
    const { error } = await signIn(loginData.email, loginData.password);
    if (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast({ variant: "destructive", title: "Login Failed", description: errorMessage });
    } else {
      toast({ title: "Welcome back!", description: "You've successfully logged in." });
      navigate("/");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!signupData.phone.match(/^[0-9]{10}$/)) {
      setError("Please enter a valid 10-digit Indian phone number");
      return;
    }
    try {
      authSchema.parse({ email: signupData.email, password: signupData.password, fullName: signupData.fullName });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const firstError = validationError.errors[0];
        setError(firstError.message);
        return;
      }
    }
    setLoading(true);
    const phoneWithPrefix = `+91${signupData.phone}`;
    const { error } = await signUp(signupData.email, signupData.password, signupData.fullName, phoneWithPrefix);

    if (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: errorMessage,
      });
      setLoading(false);
    } else {
      // Show OTP verification screen
      setPendingEmail(signupData.email);
      setShowOTPVerification(true);
      toast({
        title: "OTP Sent!",
        description: "Please check your email for the verification code.",
      });
      setError("");
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP code");
      return;
    }

    setLoading(true);

    const { data: _data, error } = await verifyOTP(pendingEmail, otpCode);

    if (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: errorMessage,
      });
      setLoading(false);
    } else {
      try {
        // Fetch authenticated user
        const { data: userData } = await supabase.auth.getUser();
        const authedUser = userData?.user;
        if (authedUser) {
          const fullName = signupData.fullName;
          const phoneE164 = `+91${signupData.phone}`;
          // Upsert profile row
          await supabase.from('profiles').upsert([{
            id: authedUser.id,
            email: authedUser.email || '',
            full_name: fullName,
            phone: phoneE164,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          }]);
          // Mark profile completed in user metadata
          await supabase.auth.updateUser({
            data: {
              profile_completed: true,
              full_name: fullName,
              phone: phoneE164,
            },
          });
        }
        toast({
          title: "Email Verified!",
          description: "Account ready. Welcome!",
        });
      } catch (profileErr: any) {
        console.error('Profile creation error:', profileErr);
        toast({ variant: 'destructive', title: 'Profile setup issue', description: 'Signed in, but profile could not be saved.' });
      }
      setError("");
      setShowOTPVerification(false);
      setOtpCode("");
      setPendingEmail("");
      setSignupData({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        confirmPassword: "",
      });
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    const { error } = await resendOTP(pendingEmail);

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to Resend OTP",
        description: getErrorMessage(error),
      });
    } else {
      toast({
        title: "OTP Resent!",
        description: "A new verification code has been sent to your email.",
      });
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
  <div className="fixed inset-0 bg-[#368bb7] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Disable body scroll while auth page mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#368bb7] flex items-center justify-center mobile-frame h-[100dvh]">
      <div className="w-full max-w-md space-y-4 px-safe-edge pb-safe-edge max-h-[100dvh] overflow-y-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Logo and Branding */}
        <div className="flex flex-col items-center space-y-1 text-white">
          <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center p-2 sm:p-3 animate-fade-in">
            <img 
              src={citylifesLogo} 
              alt="citylifes" 
              className="w-full h-full object-contain drop-shadow-none"
              width="168"
              height="168"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
            />
          </div>
          <h1 className="text-3xl font-bold animate-fade-in">citylifes</h1>
          <p className="text-base text-white/90 animate-fade-in">Find your perfect space</p>
        </div>

        {/* OTP Verification Card */}
        {showOTPVerification ? (
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Verify Your Email</h2>
                  <p className="text-muted-foreground text-sm">
                    We've sent a 6-digit verification code to <strong>{pendingEmail}</strong>
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-code" className="text-base font-medium">
                      Verification Code
                    </Label>
                    <Input
                      id="otp-code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      className="h-12 text-center text-2xl tracking-widest"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-[#368bb7] hover:bg-[#2d7298]" 
                    disabled={loading || otpCode.length !== 6}
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </Button>
                </form>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm"
                  >
                    Didn't receive the code? Resend OTP
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowOTPVerification(false);
                    setOtpCode("");
                    setPendingEmail("");
                    setError("");
                  }}
                  className="w-full text-sm"
                >
                  Back to Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Auth Card */
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="text-base">Sign Up</TabsTrigger>
                </TabsList>

              <TabsContent value="login" className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-base font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12 text-base"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-base font-medium">
                        Password
                      </Label>
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 text-sm h-auto"
                        onClick={() => navigate("/forgot-password")}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-12 text-base pr-10"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-[#368bb7] hover:bg-[#2d7298]" 
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base"
                  onClick={async () => {
                    setError("");
                    const { error } = await signInWithGoogle();
                    if (error) {
                      setError(error.message || 'Google sign-in failed');
                    }
                  }}
                >
                  Continue with Google
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-base font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      className="h-12 text-base"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({ ...signupData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-base font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12 text-base"
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({ ...signupData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="text-base font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground font-medium">
                        +91
                      </span>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="9876543210"
                        className="pl-12 h-12 text-base"
                        value={signupData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setSignupData({ ...signupData, phone: value });
                        }}
                        maxLength={10}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter 10-digit mobile number (India)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-base font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-12 text-base pr-10"
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({ ...signupData, password: e.target.value })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-[#368bb7] hover:bg-[#2d7298]" 
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base"
                  onClick={async () => {
                    setError("");
                    const { error } = await signInWithGoogle();
                    if (error) {
                      setError(error.message || 'Google sign-in failed');
                    }
                  }}
                >
                  Continue with Google
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        )}

        {/* Terms & Privacy */}
        <p className="text-center text-white/80 text-sm px-4">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
