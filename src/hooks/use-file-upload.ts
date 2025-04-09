
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseFileUploadOptions {
  userId: string;
  bucketName: string;
  isPublic?: boolean;
}

interface FileUploadResult {
  fileUrls: string[];
  publicUrls?: string[];
  error: Error | null;
}

export const useFileUpload = ({ userId, bucketName, isPublic = true }: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Function to check if bucket exists
  const checkBucketExists = async (bucketName: string): Promise<boolean> => {
    try {
      console.log(`Checking if bucket ${bucketName} exists...`);
      const { data, error } = await supabase.storage.getBucket(bucketName);
      
      if (error) {
        console.warn(`Error checking bucket ${bucketName}:`, error);
        return false;
      }
      
      console.log(`Bucket ${bucketName} exists:`, data);
      return true;
    } catch (error) {
      console.warn(`Error in checkBucketExists for ${bucketName}:`, error);
      return false;
    }
  };

  // Function to create a bucket if it doesn't exist
  const createBucket = async (bucketName: string, isPublic: boolean): Promise<boolean> => {
    try {
      console.log(`Creating bucket ${bucketName}...`);
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (error) {
        console.error(`Failed to create bucket ${bucketName}:`, error);
        return false;
      }
      
      console.log(`Successfully created bucket ${bucketName}`);
      return true;
    } catch (error) {
      console.error(`Error in createBucket for ${bucketName}:`, error);
      return false;
    }
  };

  const uploadFiles = async (files: File[]): Promise<FileUploadResult> => {
    if (!userId) {
      return { fileUrls: [], error: new Error("User not authenticated") };
    }

    if (!files.length) {
      return { fileUrls: [], error: null };
    }

    setIsUploading(true);
    const fileUrls: string[] = [];
    const publicUrls: string[] = [];

    try {
      // First check if bucket exists
      let bucketExists = await checkBucketExists(bucketName);
      
      // If bucket doesn't exist, try to create it
      if (!bucketExists) {
        bucketExists = await createBucket(bucketName, isPublic);
        
        // If we still can't access or create the bucket, use a fallback approach
        if (!bucketExists) {
          console.log(`Cannot access or create bucket ${bucketName}, using default 'images' bucket as fallback`);
          // Try with a different bucket name
          bucketExists = await checkBucketExists('images');
          
          if (!bucketExists) {
            bucketExists = await createBucket('images', true);
            
            if (!bucketExists) {
              throw new Error(`Cannot upload files. Storage is not properly configured.`);
            } else {
              bucketName = 'images'; // Use the fallback bucket
            }
          } else {
            bucketName = 'images'; // Use the fallback bucket
          }
        }
      }

      for (const file of files) {
        const fileName = `${userId}/${Date.now()}_${file.name}`;
        
        console.log(`Uploading ${file.name} to ${bucketName} bucket...`);
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            upsert: true,
            cacheControl: '3600'
          });

        if (error) {
          console.error(`Error uploading file to ${bucketName}:`, error);
          throw error;
        }

        fileUrls.push(fileName);
        
        // Get the public URL
        const publicUrl = supabase.storage.from(bucketName).getPublicUrl(fileName).data.publicUrl;
        publicUrls.push(publicUrl);
        
        console.log(`Successfully uploaded ${fileName} to ${bucketName}`);
      }

      return { fileUrls, publicUrls, error: null };
    } catch (error) {
      console.error(`Error in upload process:`, error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "File upload failed"
      });
      return { fileUrls, error: error instanceof Error ? error : new Error(String(error)) };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFiles, isUploading };
};
