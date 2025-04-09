
import { supabase, initializeStorage } from '@/integrations/supabase/client';

// This function initializes all storage buckets needed by the application
export const initializeAppStorage = async () => {
  try {
    console.log("Initializing app storage...");
    
    // Check if we have a logged in user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Initialize all required storage buckets
      await initializeStorage();
      console.log("App storage initialized successfully");
    } else {
      console.log("No user logged in, skipping storage initialization");
    }
    
    return true;
  } catch (error) {
    console.error("Failed to initialize app storage:", error);
    return false;
  }
};

// Helper function to check if a specific bucket exists
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    return !error && !!data;
  } catch (error) {
    console.error(`Error checking bucket ${bucketName}:`, error);
    return false;
  }
};
