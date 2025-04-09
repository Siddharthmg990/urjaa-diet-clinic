
import { useState } from 'react';
import { supabase, ensureBucketExists } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseFileUploadOptions {
  userId: string;
  bucketName: string;
}

interface FileUploadResult {
  fileUrls: string[];
  error: Error | null;
}

export const useFileUpload = ({ userId, bucketName }: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFiles = async (files: File[]): Promise<FileUploadResult> => {
    if (!userId) {
      return { fileUrls: [], error: new Error("User not authenticated") };
    }

    if (!files.length) {
      return { fileUrls: [], error: null };
    }

    setIsUploading(true);
    const fileUrls: string[] = [];

    try {
      // Ensure bucket exists before attempting to upload
      const bucketExists = await ensureBucketExists(bucketName);
      
      if (!bucketExists) {
        throw new Error(`Cannot upload to bucket "${bucketName}". Bucket does not exist or could not be created.`);
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
        console.log(`Successfully uploaded ${fileName} to ${bucketName}`);
      }

      return { fileUrls, error: null };
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
