
import { supabase, initializeStorage } from '@/integrations/supabase/client';

// This function runs once when the application loads
export const setupAppOnLoad = async () => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      console.log("User is logged in, initializing storage...");
      await initializeStorage();
    }
    
    // Set up listener for auth state changes to ensure storage is initialized when user logs in
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("User signed in, initializing storage...");
        await initializeStorage();
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error setting up application:", error);
    return false;
  }
};
