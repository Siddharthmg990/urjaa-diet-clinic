
import { supabase, initializeStorage } from '@/integrations/supabase/client';

// This function runs once when the application loads
export const setupAppOnLoad = async () => {
  try {
    // Initialize storage bucket immediately, regardless of auth state
    await initializeStorage();
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Set up listener for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("User signed in, ensuring storage is initialized...");
        await initializeStorage();
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error setting up application:", error);
    return false;
  }
};
