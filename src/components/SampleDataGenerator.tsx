
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createSampleData } from '@/utils/createSampleData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, ensureBucketExists, initializeStorage } from '@/integrations/supabase/client';

export const SampleDataGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize storage on component mount
  useEffect(() => {
    const setupStorage = async () => {
      if (!user?.id) return;
      
      setIsInitializing(true);
      try {
        console.log("Initializing storage from SampleDataGenerator...");
        await initializeStorage();
        setStorageReady(true);
      } catch (error) {
        console.error("Error initializing storage:", error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    if (user?.id) {
      setupStorage();
    }
  }, [user?.id]);

  const handleGenerateSampleData = async () => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to generate sample data.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Ensure storage is ready before generating sample data
      if (!storageReady) {
        console.log("Initializing storage before generating sample data...");
        await initializeStorage();
      }
      
      const result = await createSampleData(user.id);
      if (result.success) {
        toast({
          title: "Sample Data Generated",
          description: "Sample diet plan and appointments have been created for your account.",
        });
      } else {
        throw new Error(result.error?.message || "Failed to generate sample data");
      }
    } catch (error: any) {
      console.error("Sample data generation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while generating sample data.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {isInitializing ? (
        <div className="text-amber-600 mb-2 text-sm">
          Initializing storage system...
        </div>
      ) : !storageReady && (
        <div className="text-amber-600 mb-2 text-sm">
          Storage system may not be properly configured. Some features like file uploads might not work correctly.
        </div>
      )}
      <Button 
        variant="outline"
        onClick={handleGenerateSampleData}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? "Generating..." : "Generate Sample Data"}
      </Button>
    </div>
  );
};
