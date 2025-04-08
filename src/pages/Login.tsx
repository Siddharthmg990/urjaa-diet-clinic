
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { GoogleLogo } from "@/components/GoogleLogo";
import { PhoneIcon } from "lucide-react";

const Login = () => {
  // Email login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Phone login states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  
  const [activeTab, setActiveTab] = useState("email");
  const { login, loginWithGoogle, verifyPhone } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      const redirectPath = email.includes("dietitian") 
        ? "/dietitian/dashboard" 
        : "/user/dashboard";
      navigate(redirectPath);
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // In a real app, this would actually send an OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSentOtp(true);
      setError("");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid OTP");
      return;
    }
    
    setVerifyingOtp(true);
    setError("");
    
    try {
      await verifyPhone(phone, otp);
      navigate("/user/dashboard");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/user/dashboard");
    } catch (err) {
      setError("Failed to log in with Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nourish-light p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img 
              src="/lovable-uploads/f7765fc9-936c-46a5-ae43-a10b6865058a.png" 
              alt="Urjaa Diet Clinic Logo" 
              className="h-12 mx-auto"
            />
          </Link>
          <h2 className="text-2xl font-semibold mt-4">Welcome back</h2>
          <p className="text-gray-500 mt-1">Log in to your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={handleEmailSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-right">
                  <a href="#" className="text-sm text-nourish-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-nourish-primary hover:bg-nourish-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </Button>

                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <Button 
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                >
                  <GoogleLogo className="h-5 w-5" />
                  Sign in with Google
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="phone">
            {!sentOtp ? (
              <form onSubmit={handleSendOtp}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <div className="bg-gray-100 border border-gray-300 rounded-l-md p-2 px-3 text-gray-500">
                        +91
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        className="rounded-l-none"
                        placeholder="9284735115"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-nourish-primary hover:bg-nourish-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="otp" className="block mb-2">Enter OTP sent to +91 {phone}</Label>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      render={({ slots }) => (
                        <InputOTPGroup className="gap-2 flex justify-center">
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} index={index} className="w-10 h-12" />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                    <div className="text-center mt-2">
                      <button 
                        type="button" 
                        onClick={() => setSentOtp(false)}
                        className="text-sm text-nourish-primary hover:underline"
                      >
                        Change phone number
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-nourish-primary hover:bg-nourish-dark"
                    disabled={verifyingOtp}
                  >
                    {verifyingOtp ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-nourish-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
