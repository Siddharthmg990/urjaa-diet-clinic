
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://frsijcoffdlkwzrbwjhp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyc2lqY29mZmRsa3d6cmJ3amhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTYzMDQsImV4cCI6MjA1OTU5MjMwNH0.tdFKSPYo4LDdpQQXkGe0MEkZyGSD2mZU4HVWIknCfFY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    // Add better logging for debugging
    fetch: (url, options) => {
      return fetch(url, options).then((response) => {
        if (!response.ok) {
          console.error(`Supabase fetch error: ${response.status} ${response.statusText}`, url);
        }
        return response;
      }).catch(error => {
        console.error("Supabase fetch network error:", error);
        throw error;
      });
    }
  }
});

// Improved helper function to check if a bucket exists and create it if it doesn't
export const ensureBucketExists = async (bucketId: string, isPublic = true): Promise<boolean> => {
  if (!bucketId) {
    console.error('Invalid bucket ID provided');
    return false;
  }

  console.log(`Ensuring bucket ${bucketId} exists...`);
  
  // Try up to 3 times to create/verify the bucket
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // First try to get the bucket directly
      const { data, error: getBucketError } = await supabase.storage.getBucket(bucketId);
      
      if (!getBucketError && data) {
        console.log(`Bucket ${bucketId} already exists (attempt ${attempt})`);
        return true;
      }
      
      // If bucket doesn't exist, try to create it
      console.log(`Creating bucket ${bucketId} (attempt ${attempt})`);
      const { error: createError } = await supabase.storage.createBucket(bucketId, {
        public: isPublic,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (!createError) {
        console.log(`Successfully created bucket ${bucketId}`);
        return true;
      }
      
      console.error(`Error creating bucket ${bucketId} (attempt ${attempt}):`, createError);
      
      // If we can't create it, check if it now exists (might have been created by another process)
      const { data: recheckedData, error: recheckError } = await supabase.storage.getBucket(bucketId);
      
      if (!recheckError && recheckedData) {
        console.log(`Bucket ${bucketId} exists after recheck`);
        return true;
      }
      
      // If we're on the last attempt, try the more extensive fallback approach
      if (attempt === 3) {
        console.log(`Attempting fallback check for bucket ${bucketId}...`);
        
        // Try listing all buckets as a fallback
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          console.error(`Error listing buckets:`, listError);
          return false;
        }
        
        const bucketExists = buckets?.some(bucket => bucket.name === bucketId);
        
        if (bucketExists) {
          console.log(`Bucket ${bucketId} found via listing`);
          return true;
        }
        
        // One last attempt to create the bucket
        console.log(`Final attempt to create bucket ${bucketId}`);
        const { error: finalCreateError } = await supabase.storage.createBucket(bucketId, {
          public: isPublic,
          fileSizeLimit: 10485760
        });
        
        if (!finalCreateError) {
          console.log(`Successfully created bucket ${bucketId} in final attempt`);
          return true;
        }
        
        console.error(`Failed all attempts to create/verify bucket ${bucketId}`);
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < 3) {
        const delay = attempt * 1000; // 1s, 2s
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`Unexpected error handling bucket ${bucketId} (attempt ${attempt}):`, error);
      
      if (attempt === 3) {
        return false;
      }
      
      // Wait before retrying
      const delay = attempt * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return false;
};

// Check default buckets at the earliest possible time
export const initializeStorage = async () => {
  console.log("Initializing storage buckets...");
  const buckets = ["health_photos", "medical_reports", "profile_pictures", "appointment_files"];
  
  for (const bucket of buckets) {
    await ensureBucketExists(bucket);
  }
  
  console.log("Storage initialization complete");
};

// Utility function to handle file uploads with better error handling
export const uploadFile = async (
  bucketId: string, 
  userId: string, 
  file: File,
  options?: { 
    customPath?: string, 
    isPublic?: boolean,
    onProgress?: (progress: number) => void
  }
): Promise<{ path: string | null; publicUrl: string | null; error: Error | null }> => {
  try {
    // Ensure bucket exists
    const bucketExists = await ensureBucketExists(bucketId, options?.isPublic ?? true);
    
    if (!bucketExists) {
      throw new Error(`Cannot upload to bucket "${bucketId}". Storage is not properly configured.`);
    }
    
    // Create file path
    const fileName = options?.customPath || `${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketId)
      .upload(fileName, file, {
        upsert: true,
        cacheControl: '3600'
      });
    
    if (error) {
      throw error;
    }
    
    // Get public URL if successful
    const publicUrl = supabase.storage.from(bucketId).getPublicUrl(fileName).data.publicUrl;
    
    return { path: fileName, publicUrl, error: null };
  } catch (error) {
    console.error(`Error uploading file to ${bucketId}:`, error);
    return { path: null, publicUrl: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};
