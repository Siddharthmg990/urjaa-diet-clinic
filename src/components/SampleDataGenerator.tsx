
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createSampleData } from '@/utils/createSampleData';
import { useAuth } from '@/contexts/AuthContext';
import { ensureBucketExists } from '@/integrations/supabase/client';

export const SampleDataGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
      // First ensure both buckets exist
      await ensureBucketExists('health_photos');
      await ensureBucketExists('medical_reports');
      
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
    <Button 
      variant="outline"
      onClick={handleGenerateSampleData}
      disabled={isGenerating}
      className="w-full"
    >
      {isGenerating ? "Generating..." : "Generate Sample Data"}
    </Button>
  );
};
