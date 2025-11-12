import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, verifyPasswordResetOTP } = useAuth();
  
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOTPScreen, setShowOTPScreen] = useState(searchParams.get('reset') === 'true');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await resetPassword(email);

    setLoading(false);

    if (error) {
      setError(error.message || "Failed to send reset code");
      toast.error("Failed to send reset code");
      return;
    }

    setShowOTPScreen(true);
    toast.success("Reset code sent to your email!");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await verifyPasswordResetOTP(email, otpCode, newPassword);

    setLoading(false);

    if (error) {
      setError(error.message || "Failed to reset password");
      toast.error("Failed to reset password");
      return;
    }

    toast.success("Password reset successfully!");
    navigate("/auth");
  };

  const handleResendOTP = async () => {
    setError("");
    setLoading(true);

    const { error } = await resetPassword(email);

    setLoading(false);

    if (error) {
      toast.error("Failed to resend code");
      return;
    }

    toast.success("Reset code resent!");
  };

  return (
    <div className="fixed inset-0 bg-[#368ab6] flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md space-y-6 max-h-[100vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col items-center space-y-3 text-white">
          <h1 className="text-4xl font-bold">Reset Password</h1>
          <p className="text-lg text-white/90">Recover your account</p>
        </div>

        {showOTPScreen ? (
          /* OTP and New Password Screen */
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Enter Reset Code</h2>
                  <p className="text-muted-foreground text-sm">
                    We've sent a 6-digit code to <strong>{email}</strong>
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-code" className="text-base font-medium">
                      Reset Code
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

                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-base font-medium">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 text-base"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-base font-medium">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 text-base"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-[#368ab6] hover:bg-[#2d7298]" 
                    disabled={loading || otpCode.length !== 6}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
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
                    Didn't receive the code? Resend
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowOTPScreen(false);
                    setOtpCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  className="w-full text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Email
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Email Input Screen */
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h2>
                  <p className="text-muted-foreground text-sm">
                    Enter your email to receive a reset code
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12 text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-[#368ab6] hover:bg-[#2d7298]" 
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Code"}
                  </Button>
                </form>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/auth")}
                  className="w-full text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-white/80 text-sm px-4">
          Remember your password? <button onClick={() => navigate("/auth")} className="underline font-medium">Sign in</button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
