
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail } from "lucide-react";
import citylifesLogo from "@/assets/citylifes-logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Disable body scroll while auth page mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-[#368bb7] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 mb-4">
              <img src={citylifesLogo} alt="CityLifes" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to continue to Citylifes</p>
            </div>
          </div>

          {/* Auth Button */}
          <div className="pt-4 pb-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full h-14 text-base font-medium border-2 hover:bg-slate-50 hover:border-[#368bb7]/30 transition-all duration-200 flex items-center justify-center gap-3 rounded-full shadow-sm group text-gray-900 hover:text-gray-900 bg-white"
              onClick={async () => {
                setError("");
                const { error } = await signInWithGoogle();
                if (error) {
                  setError(error.message || 'Google sign-in failed');
                }
              }}
            >
              <svg className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            {error && (
              <Alert variant="destructive" className="mt-6 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Footer Terms */}
          <p className="text-center text-xs text-muted-foreground px-8 leading-relaxed">
            By continuing, you agree to our{' '}
            <Link to="/terms-of-service" className="underline hover:text-[#368bb7] font-medium">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy-policy" className="underline hover:text-[#368bb7] font-medium">Privacy Policy</Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Feature Showcase (Desktop Only as per image style) */}
      <div className="hidden lg:flex w-1/2 bg-[#368bb7] relative overflow-hidden flex-col justify-center items-center p-12 text-white">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDuration: '3000ms' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDuration: '4000ms' }}></div>

        <div className="relative z-10 max-w-lg space-y-12">
          {/* Hero Content */}
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Join Citylifes Community</h2>
            <p className="text-lg text-white/90 leading-relaxed font-light">
              Discover your perfect space with live map search, verified listings, and instant connections.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            {[
              "10,000+ monthly searches",
              "Verified property listings",
              "Instant contact with owners",
              "Smart filters & live maps"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-[#4fd1c5] flex items-center justify-center shrink-0 shadow-lg">
                  <svg className="w-5 h-5 text-white bg-transparent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
