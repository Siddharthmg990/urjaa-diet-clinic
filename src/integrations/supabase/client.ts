
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

// Create a simplified version of the bucket check/creation function
export const ensureBucketExists = async (bucketId: string, isPublic = true): Promise<boolean> => {
  if (!bucketId) {
    console.error('Invalid bucket ID provided');
    return false;
  }

  try {
    // First check if the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketId);
    
    if (bucketExists) {
      console.log(`Bucket ${bucketId} already exists`);
      return true;
    }
    
    console.log(`Creating bucket ${bucketId}...`);
    const { error } = await supabase.storage.createBucket(bucketId, {
      public: isPublic,
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (error) {
      console.error(`Error creating bucket ${bucketId}:`, error);
      return false;
    }
    
    console.log(`Successfully created bucket ${bucketId}`);
    return true;
  } catch (error) {
    console.error(`Unexpected error with bucket ${bucketId}:`, error);
    return false;
  }
};

// Initialize storage with a single bucket for better reliability
export const initializeStorage = async () => {
  console.log("Initializing storage bucket...");
  
  // Create a single bucket for all uploads
  const bucketCreated = await ensureBucketExists('user_uploads', true);
  
  if (bucketCreated) {
    console.log("Storage initialization complete");
    return true;
  } else {
    console.error("Failed to initialize storage");
    return false;
  }
};

// Simplified file upload function with better error handling
export const uploadFile = async (
  bucketId: string, 
  userId: string, 
  file: File,
  options?: { 
    customPath?: string, 
    isPublic?: boolean,
  }
) => {
  try {
    // Create file path with user ID for organization
    const fileId = Date.now();
    const fileExt = file.name.split('.').pop();
    const safeFileName = `${userId}/${fileId}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const fileName = options?.customPath || safeFileName;
    
    console.log(`Uploading file to ${bucketId}/${fileName}...`);
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketId)
      .upload(fileName, file, {
        upsert: true,
        cacheControl: '3600'
      });
    
    if (error) {
      console.error(`Upload error:`, error);
      throw error;
    }
    
    // Get public URL if successful
    const { data: { publicUrl } } = supabase.storage.from(bucketId).getPublicUrl(fileName);
    
    console.log(`File uploaded successfully to ${fileName}`);
    return { path: fileName, publicUrl, error: null };
  } catch (error) {
    console.error(`Error uploading file to ${bucketId}:`, error);
    return { 
      path: null, 
      publicUrl: null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
};
