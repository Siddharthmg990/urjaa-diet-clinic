
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/api/client';

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
        const { data } = await apiClient.post('/storage/initialize');
        setIsBucketReady(data.success);
        if (data.success) {
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
      await apiClient.post('/storage/initialize');
      
      // Upload each file
      for (const file of files) {
        console.log(`Uploading ${file.name}...`);
        
        // Create form data for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket_id', currentBucket);
        formData.append('user_id', userId);
        formData.append('is_public', isPublic.toString());
        
        // Upload the file
        const { data } = await apiClient.post('/storage/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (data.path) fileUrls.push(data.path);
        if (data.publicUrl) publicUrls.push(data.publicUrl);
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
