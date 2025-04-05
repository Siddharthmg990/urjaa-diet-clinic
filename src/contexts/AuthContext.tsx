
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type UserRole = "user" | "dietitian" | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isDietitian: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("nourish-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("nourish-user");
      }
    }
    setIsLoading(false);
  }, []);
  
  // In a real app, this would communicate with a backend
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user roles based on email domain for demo purposes
      const role: UserRole = email.includes("dietitian") ? "dietitian" : "user";
      const userId = `user_${Math.random().toString(36).substring(2, 11)}`;
      const name = email.split('@')[0];
      
      const userData: User = {
        id: userId,
        email,
        name,
        role
      };
      
      setUser(userData);
      localStorage.setItem("nourish-user", JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${name}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, automatically assign user role
      const userData: User = {
        id: `user_${Math.random().toString(36).substring(2, 11)}`,
        email,
        name,
        role: "user" // New registrations are always users
      };
      
      setUser(userData);
      localStorage.setItem("nourish-user", JSON.stringify(userData));
      
      toast({
        title: "Registration successful",
        description: `Welcome to Nourish, ${name}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again later",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("nourish-user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  const isDietitian = () => user?.role === "dietitian";
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        isDietitian,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
