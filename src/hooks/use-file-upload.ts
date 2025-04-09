
import { useState, useEffect } from 'react';
import { supabase, ensureBucketExists, uploadFile } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseFileUploadOptions {
  userId: string;
  bucketName: string;
  isPublic?: boolean;
  fallbackBucket?: string;
}

interface FileUploadResult {
  fileUrls: string[];
  publicUrls: string[];
  error: Error | null;
}

export const useFileUpload = ({
  userId,
  bucketName,
  isPublic = true,
  fallbackBucket = 'images'
}: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isBucketReady, setIsBucketReady] = useState(false);
  const [activeBucket, setActiveBucket] = useState(bucketName);
  const { toast } = useToast();

  // Check bucket status when component mounts
  useEffect(() => {
    const checkBucket = async () => {
      try {
        let exists = await ensureBucketExists(bucketName, isPublic);
        
        if (!exists && fallbackBucket) {
          console.log(`Primary bucket ${bucketName} unavailable, checking fallback ${fallbackBucket}`);
          exists = await ensureBucketExists(fallbackBucket, true);
          
          if (exists) {
            setActiveBucket(fallbackBucket);
          }
        }
        
        setIsBucketReady(exists);
      } catch (error) {
        console.error("Error checking bucket status:", error);
        setIsBucketReady(false);
      }
    };
    
    if (userId) {
      checkBucket();
    }
  }, [userId, bucketName, fallbackBucket, isPublic]);

  const uploadFiles = async (files: File[]): Promise<FileUploadResult> => {
    if (!userId) {
      return { fileUrls: [], publicUrls: [], error: new Error("User not authenticated") };
    }

    if (!files.length) {
      return { fileUrls: [], publicUrls: [], error: null };
    }

    setIsUploading(true);
    const fileUrls: string[] = [];
    const publicUrls: string[] = [];

    try {
      // Double-check bucket exists just before upload
      const currentBucket = activeBucket || bucketName;
      let bucketExists = await ensureBucketExists(currentBucket, isPublic);
      
      // Try fallback if primary bucket isn't available
      if (!bucketExists && fallbackBucket && currentBucket !== fallbackBucket) {
        console.log(`Switching to fallback bucket ${fallbackBucket} for upload`);
        bucketExists = await ensureBucketExists(fallbackBucket, true);
        
        if (bucketExists) {
          setActiveBucket(fallbackBucket);
        } else {
          throw new Error(`Cannot upload files. Storage is not properly configured.`);
        }
      } else if (!bucketExists) {
        throw new Error(`Cannot upload files. Bucket "${currentBucket}" is not available.`);
      }

      // Upload each file
      for (const file of files) {
        const uploadBucket = activeBucket || bucketName;
        console.log(`Uploading ${file.name} to ${uploadBucket} bucket...`);
        
        const { path, publicUrl, error } = await uploadFile(uploadBucket, userId, file, { isPublic });
        
        if (error) {
          throw error;
        }
        
        if (path) fileUrls.push(path);
        if (publicUrl) publicUrls.push(publicUrl);
      }

      return { fileUrls, publicUrls, error: null };
    } catch (error) {
      console.error(`Error in upload process:`, error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "File upload failed"
      });
      return { 
        fileUrls, 
        publicUrls, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    } finally {
      setIsUploading(false);
    }
  };

  return { 
    uploadFiles, 
    isUploading, 
    isBucketReady, 
    activeBucket 
  };
};
