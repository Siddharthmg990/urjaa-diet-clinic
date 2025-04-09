
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

// Helper function to check if a bucket exists and create it if it doesn't
export const ensureBucketExists = async (bucketId: string, isPublic = true) => {
  try {
    // First check if the bucket exists
    const { data: buckets, error: getBucketError } = await supabase
      .storage
      .listBuckets();
    
    if (getBucketError) {
      console.error(`Error checking bucket ${bucketId}:`, getBucketError);
      throw getBucketError;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketId);
    
    if (!bucketExists) {
      console.log(`Bucket ${bucketId} doesn't exist, creating it...`);
      const { error: createBucketError } = await supabase
        .storage
        .createBucket(bucketId, { public: isPublic });
      
      if (createBucketError) {
        console.error(`Error creating bucket ${bucketId}:`, createBucketError);
        throw createBucketError;
      }
      console.log(`Successfully created bucket ${bucketId}`);
    } else {
      console.log(`Bucket ${bucketId} already exists`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to ensure bucket ${bucketId} exists:`, error);
    return false;
  }
};
