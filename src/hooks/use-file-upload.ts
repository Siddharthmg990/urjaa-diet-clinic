
import { useState, useEffect } from 'react';
import { supabase, initializeStorage, uploadFile } from '@/integrations/supabase/client';
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
  fallbackBucket
}: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isBucketReady, setIsBucketReady] = useState(false);
  const [activeBucket, setActiveBucket] = useState(bucketName);
  const { toast } = useToast();

  // Initialize storage right after component mounts if user is available
  useEffect(() => {
    const setupStorage = async () => {
      if (!userId) return;
      
      try {
        const success = await initializeStorage();
        setIsBucketReady(success);
        if (success) {
          setActiveBucket('user_uploads'); // Use our standardized bucket
        }
      } catch (error) {
        console.error("Error initializing storage:", error);
        setIsBucketReady(false);
      }
    };
    
    if (userId) {
      setupStorage();
    }
  }, [userId]);

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
      // Always use our initialized bucket
      const currentBucket = 'user_uploads';
      
      // Make sure storage is initialized
      await initializeStorage();
      
      // Upload each file
      for (const file of files) {
        console.log(`Uploading ${file.name}...`);
        
        const { path, publicUrl, error } = await uploadFile(currentBucket, userId, file, { isPublic });
        
        if (error) {
          throw error;
        }
        
        if (path) fileUrls.push(path);
        if (publicUrl) publicUrls.push(publicUrl);
      }

      console.log(`Successfully uploaded ${files.length} files`);
      return { fileUrls, publicUrls, error: null };
    } catch (error) {
      console.error(`Upload error:`, error);
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
    activeBucket: 'user_uploads' // Always use our standardized bucket
  };
};
