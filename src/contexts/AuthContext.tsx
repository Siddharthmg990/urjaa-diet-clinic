
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type User, type Session, type Provider } from '@supabase/supabase-js';
import { toast as sonnerToast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types/supabase";

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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch the user profile data
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
                
              if (error) throw error;
              
              const typedProfile = profile as Profile;
              
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email,
                name: typedProfile?.name || currentSession.user.user_metadata?.name || 'User',
                role: (typedProfile?.role as UserRole) || 'user',
                phone: typedProfile?.phone,
                phoneVerified: typedProfile?.phone_verified
              });

              // Handle redirection based on authentication event
              if (event === 'SIGNED_IN') {
                if (typedProfile) {
                  if (typedProfile.phone_verified) {
                    if (typedProfile.role === 'dietitian') {
                      navigate('/dietitian/dashboard', { replace: true });
                    } else {
                      navigate('/user/dashboard', { replace: true });
                    }
                  } else {
                    navigate('/user/questionnaire', { replace: true });
                  }
                }
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email,
                name: currentSession.user.user_metadata?.name || 'User',
                role: 'user',
                phone: null,
                phoneVerified: false
              });
            } finally {
              setIsLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        // Fetch the user profile data
        supabase
          .from('profiles')
          .select('*')
          .eq('id', initialSession.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (!error && profile) {
              const typedProfile = profile as Profile;
              
              setUser({
                id: initialSession.user.id,
                email: initialSession.user.email,
                name: typedProfile.name || initialSession.user.user_metadata?.name || 'User',
                role: (typedProfile.role as UserRole) || 'user',
                phone: typedProfile.phone,
                phoneVerified: typedProfile.phone_verified
              });
            } else {
              setUser({
                id: initialSession.user.id,
                email: initialSession.user.email,
                name: initialSession.user.user_metadata?.name || 'User',
                role: 'user',
                phone: null,
                phoneVerified: false
              });
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: `Welcome back${data.user?.user_metadata?.name ? ', ' + data.user.user_metadata.name : ''}!`,
      });

      // Redirect will be handled by onAuthStateChange
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
      });
      throw error;
    }
  };
  
  const register = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: `Welcome to Urjaa Diet Clinic, ${name}!`,
      });

      // Redirect will be handled by onAuthStateChange
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Please try again later",
      });
      throw error;
    }
  };

  const loginWithProvider = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${provider} login failed`,
        description: error.message || "Please try again later",
      });
      throw error;
    }
  };

  const loginWithGoogle = () => loginWithProvider('google');
  const registerWithGoogle = () => loginWithGoogle();

  const verifyPhone = async (phone: string, otp: string, name?: string) => {
    setIsLoading(true);
    
    try {
      // For now, we're simulating phone verification
      // In a real app, you would use a service like Twilio for SMS OTPs
      const formattedPhone = `+91${phone}`; // Format for India
      
      // Update the user's phone number
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            phone: formattedPhone,
            phone_verified: true,
            name: name || user.name
          } as Profile)
          .eq('id', user.id);
        
        if (error) throw error;
        
        // Update local state
        setUser(prev => prev ? {
          ...prev,
          phone: formattedPhone,
          phoneVerified: true,
          name: name || prev.name || 'User'
        } : null);
        
        toast({
          title: "Phone verification successful",
          description: "Your phone number has been verified",
        });
        
        // Navigate to appropriate page
        navigate("/user/dashboard");
      } else {
        throw new Error("No authenticated user found");
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
      await supabase.auth.signOut();
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
