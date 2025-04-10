
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

// Check if a bucket exists and create it if it doesn't
export const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Checking if bucket ${bucketName} exists...`);
    
    // First try to get the bucket
    const { data: bucket, error: getBucketError } = await supabase.storage.getBucket(bucketName);
    
    // If bucket exists, return true
    if (bucket) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // If it doesn't exist, create it
    if (getBucketError && getBucketError.message.includes('not found')) {
      console.log(`Creating bucket ${bucketName}...`);
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true, // Make files publicly accessible
        fileSizeLimit: 50 * 1024 * 1024 // 50MB file size limit
      });
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
        return false;
      }
      
      console.log(`Bucket ${bucketName} created successfully`);
      return true;
    } else if (getBucketError) {
      console.error(`Error checking bucket ${bucketName}:`, getBucketError);
      return false;
    }
    
    return false;
  } catch (error) {
    console.error(`Unexpected error ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
};

// Initialize storage - simpler approach that doesn't rely on bucket creation
export const initializeStorage = async () => {
  console.log("Initializing storage...");
  try {
    // Instead of creating buckets, let's verify if we can access the storage API
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Storage initialization error:", error);
      return false;
    }
    
    // Look for existing buckets we can use
    const userUploadsBucket = data?.find(bucket => bucket.name === 'user_uploads');
    
    if (userUploadsBucket) {
      console.log("Found user_uploads bucket - storage ready to use");
      return true;
    } else {
      console.log("No suitable bucket found, will attempt to use default");
      return true; // Return true anyway - we'll handle upload errors at upload time
    }
  } catch (error) {
    console.error("Unexpected error initializing storage:", error);
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
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = options?.customPath || `${userId}/${fileId}_${safeFileName}`;
    
    console.log(`Attempting to upload file to ${bucketId}/${filePath}...`);
    
    // Upload file with proper error handling
    const { data, error } = await supabase.storage
      .from(bucketId)
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600'
      });
    
    if (error) {
      // Detailed error logging for debugging
      console.error(`Upload error:`, error);
      return { 
        path: null, 
        publicUrl: null, 
        error: new Error(error.message || "Upload failed") 
      };
    }
    
    // Get public URL if successful
    const { data: { publicUrl } } = supabase.storage.from(bucketId).getPublicUrl(filePath);
    
    console.log(`File uploaded successfully to ${filePath}`);
    return { path: filePath, publicUrl, error: null };
  } catch (error) {
    console.error(`Error in uploadFile:`, error);
    return { 
      path: null, 
      publicUrl: null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
};
