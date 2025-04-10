
import { useState } from 'react';
import { supabase, initializeStorage, uploadFile } from '@/integrations/supabase/client';
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
      const success = await initializeStorage();
      setIsStorageReady(success);
      return success;
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
      // Check storage before uploading
      await checkStorage();
      
      // Use consistent bucket name
      const targetBucket = bucketName || 'user_uploads';
      
      // Upload each file
      for (const file of files) {
        console.log(`Uploading ${file.name}...`);
        
        const { path, publicUrl, error } = await uploadFile(
          targetBucket, 
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
