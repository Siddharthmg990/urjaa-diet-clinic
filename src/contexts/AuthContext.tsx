
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { type Session, type Provider } from '@supabase/supabase-js';
import { toast as sonnerToast } from 'sonner';
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/client";
import { setupAppOnLoad } from "@/utils/setupAppOnLoad";

type UserRole = "user" | "dietitian";

interface AuthUser {
  id: string;
  email: string | undefined;
  name: string | null;
  role: UserRole;
  phone: string | null;
  phoneVerified: boolean | null;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithGoogle: () => Promise<void>;
  verifyPhone: (phone: string, otp: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  isDietitian: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize app and check for existing session
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      // Initialize storage
      await setupAppOnLoad();
      
      try {
        // Check for existing session
        const { data } = await apiClient.get('/auth/session');
        
        if (data.user && data.session) {
          setUser(data.user);
          setSession(data.session as Session);
        } else {
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const { data } = await apiClient.post('/auth/login', {
        email,
        password,
      });
      
      setUser(data.user);
      setSession(data.session as Session);
      
      // Store session in localStorage for API client interceptor
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: data.session
      }));
      
      toast({
        title: "Login successful",
        description: `Welcome back${data.user.name ? ', ' + data.user.name : ''}!`,
      });

      navigate("/user/dashboard", { replace: true });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.error || "Please check your credentials and try again",
      });
      throw error;
    }
  };
  
  const register = async (email: string, password: string, name: string) => {
    try {
      const { data } = await apiClient.post('/auth/register', {
        email,
        password,
        name
      });
      
      setUser(data.user);
      setSession(data.session as Session);
      
      // Store session in localStorage for API client interceptor
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: data.session
      }));
      
      toast({
        title: "Registration successful",
        description: `Welcome to Urjaa Diet Clinic, ${name}!`,
      });

      navigate("/user/dashboard", { replace: true });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.error || "Please try again later",
      });
      throw error;
    }
  };

  const loginWithProvider = async (provider: Provider) => {
    // For now, we'll just show a toast explaining this isn't implemented yet
    toast({
      variant: "destructive",
      title: `${provider} login not implemented`,
      description: "Social login functionality is not available in the Flask backend yet.",
    });
  };

  const loginWithGoogle = () => loginWithProvider('google');
  const registerWithGoogle = () => loginWithGoogle();

  const verifyPhone = async (phone: string, otp: string, name?: string) => {
    setIsLoading(true);
    
    try {
      const { data } = await apiClient.post('/auth/verify-phone', {
        phone,
        otp,
        name,
        user_id: user?.id
      });
      
      if (data.success) {
        setUser(prev => prev ? {
          ...prev,
          phone: data.profile.phone,
          phoneVerified: data.profile.phoneVerified,
          name: data.profile.name || prev.name || 'User'
        } : null);
        
        toast({
          title: "Phone verification successful",
          description: "Your phone number has been verified",
        });
        
        navigate("/user/dashboard");
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Phone verification failed",
        description: error.message || "Invalid OTP. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('supabase.auth.token');
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate("/login");
    } catch (error: any) {
      sonnerToast.error("Logout failed", {
        description: error.message || "Please try again",
      });
    }
  };
  
  const isDietitian = () => user?.role === "dietitian";
  
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user && !!session,
        isLoading,
        login,
        register,
        loginWithGoogle,
        registerWithGoogle,
        verifyPhone,
        logout,
        isDietitian,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
