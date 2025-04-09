
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createSampleData } from '@/utils/createSampleData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const SampleDataGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bucketsChecked, setBucketsChecked] = useState(false);
  const [bucketsExist, setBucketsExist] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if buckets exist on component mount
  useEffect(() => {
    const checkBuckets = async () => {
      try {
        // First check if buckets exist
        const { data: buckets } = await supabase.storage.listBuckets();
        
        const healthBucket = buckets?.find(b => b.name === 'health_photos');
        const reportsBucket = buckets?.find(b => b.name === 'medical_reports');
        
        setBucketsExist(!!healthBucket && !!reportsBucket);
        setBucketsChecked(true);
      } catch (error) {
        console.error("Error checking buckets:", error);
        setBucketsChecked(true);
      }
    };
    
    if (user?.id) {
      checkBuckets();
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
      {bucketsChecked && !bucketsExist && (
        <div className="text-amber-600 mb-2 text-sm">
          Note: Storage buckets may not be properly configured. Some features like file uploads might not work correctly.
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
