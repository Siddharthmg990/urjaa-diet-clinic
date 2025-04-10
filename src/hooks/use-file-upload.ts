
import { useState } from 'react';
import { supabase, initializeStorage, uploadFile, ensureBucketExists } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseFileUploadOptions {
  userId: string;
  bucketName: string;
  isPublic?: boolean;
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
}: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const { toast } = useToast();

  // Function to check if storage is initialized
  const checkStorage = async () => {
    if (!userId) return false;
    
    try {
      // First ensure the bucket exists
      const bucketExists = await ensureBucketExists(bucketName);
      if (!bucketExists) {
        console.log(`Attempting to initialize storage since bucket ${bucketName} doesn't exist`);
        await initializeStorage();
      }
      setIsStorageReady(bucketExists);
      return bucketExists;
    } catch (error) {
      console.error("Error checking storage:", error);
      setIsStorageReady(false);
      return false;
    }
  };

  const uploadFiles = async (files: File[]): Promise<FileUploadResult> => {
    if (!userId) {
      return { 
        fileUrls: [], 
        publicUrls: [], 
        error: new Error("User not authenticated") 
      };
    }

    if (!files.length) {
      return { fileUrls: [], publicUrls: [], error: null };
    }

    setIsUploading(true);
    const fileUrls: string[] = [];
    const publicUrls: string[] = [];
    
    try {
      // Ensure the bucket exists before uploading
      const bucketExists = await ensureBucketExists(bucketName);
      if (!bucketExists) {
        throw new Error(`Storage bucket ${bucketName} could not be created or accessed`);
      }
      
      setIsStorageReady(true);
      
      // Upload each file
      for (const file of files) {
        console.log(`Uploading ${file.name}...`);
        
        const { path, publicUrl, error } = await uploadFile(
          bucketName, 
          userId, 
          file, 
          { isPublic }
        );
        
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
        description: error instanceof Error 
          ? error.message 
          : "File upload failed. Please try again."
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
    isStorageReady,
    checkStorage
  };
};
