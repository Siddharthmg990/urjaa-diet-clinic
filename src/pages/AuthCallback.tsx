
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/supabase";

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session) {
          // Always redirect to user dashboard after authentication
          navigate('/user/dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        setError(error.message);
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-nourish-light">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
          <p>{error}</p>
          <p className="mt-2">Redirecting you to login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-nourish-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-nourish-primary">Completing authentication...</h2>
          <p className="text-gray-600 mt-2">Please wait while we set up your account</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
