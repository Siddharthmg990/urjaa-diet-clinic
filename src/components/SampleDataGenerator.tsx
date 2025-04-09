
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createSampleData } from '@/utils/createSampleData';
import { useAuth } from '@/contexts/AuthContext';

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
      const result = await createSampleData(user.id);
      if (result.success) {
        toast({
          title: "Sample Data Generated",
          description: "Sample diet plan and appointments have been created for your account.",
        });
      } else {
        throw new Error("Failed to generate sample data");
      }
    } catch (error: any) {
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
