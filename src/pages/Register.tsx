
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { GoogleLogo } from "@/components/GoogleLogo";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  // Email registration states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Phone registration states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [phoneRegName, setPhoneRegName] = useState("");
  
  const [activeTab, setActiveTab] = useState("email");
  const { register, registerWithGoogle, verifyPhone } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password, name);
      // The navigation will happen automatically via AuthContext
    } catch (err: any) {
      setError(err.message || "Failed to create an account");
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
    
    if (!phoneRegName.trim()) {
      setError("Please enter your name");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // In production, this would call a function to send an OTP
      // For demo, we'll simulate it
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to +91 ${phone}`,
      });
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
      await verifyPhone(phone, otp, phoneRegName);
      // The navigation will happen automatically via AuthContext
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleGoogleRegistration = async () => {
    try {
      await registerWithGoogle();
      // The navigation will happen via redirect and then AuthContext
    } catch (err: any) {
      setError(err.message || "Failed to register with Google");
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
          <h2 className="text-2xl font-semibold mt-4">Create your account</h2>
          <p className="text-gray-500 mt-1">Start your journey to better health</p>
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-nourish-primary hover:bg-nourish-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
                
                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <Button 
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleRegistration}
                >
                  <GoogleLogo className="h-5 w-5" />
                  Sign up with Google
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="phone">
            {!sentOtp ? (
              <form onSubmit={handleSendOtp}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phoneRegName">Full Name</Label>
                    <Input
                      id="phoneRegName"
                      type="text"
                      placeholder="John Doe"
                      value={phoneRegName}
                      onChange={(e) => setPhoneRegName(e.target.value)}
                      required
                    />
                  </div>
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
            Already have an account?{" "}
            <Link to="/login" className="text-nourish-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
