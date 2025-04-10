
import { supabase, initializeStorage } from '@/integrations/supabase/client';

// This function runs once when the application loads
export const setupAppOnLoad = async () => {
  try {
    console.log("Setting up application...");
    
    // Initialize storage bucket immediately
    const storageInitialized = await initializeStorage();
    console.log("Storage initialization result:", storageInitialized);
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Set up listener for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
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
