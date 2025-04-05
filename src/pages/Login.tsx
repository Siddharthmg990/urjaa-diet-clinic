
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-nourish-light p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-nourish-primary">Nourish</Link>
          <h2 className="text-2xl font-semibold mt-4">Welcome back</h2>
          <p className="text-gray-500 mt-1">Log in to your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-nourish-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        
        {/* Demo login info */}
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-sm text-center text-gray-500 font-medium">Demo Logins</p>
          <div className="text-xs text-center text-gray-500 mt-2 space-y-1">
            <p>User: any email without "dietitian" (password can be anything)</p>
            <p>Dietitian: any email with "dietitian" (password can be anything)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
