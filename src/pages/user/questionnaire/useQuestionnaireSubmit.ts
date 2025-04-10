
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase, initializeStorage } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionnaireFormData } from "./types";
import { useFileUpload } from "@/hooks/use-file-upload";

export const useQuestionnaireSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Use a single shared bucket for both types of files
  const photoUploader = useFileUpload({
    userId: user?.id || '',
    bucketName: 'user_uploads',
    fallbackBucket: 'user_uploads',
    isPublic: false // More secure for health photos
  });

  const reportUploader = useFileUpload({
    userId: user?.id || '',
    bucketName: 'user_uploads',
    fallbackBucket: 'user_uploads',
    isPublic: false // More secure for medical reports
  });
  
  const handleSubmit = async (formData: QuestionnaireFormData, validateStep: (step: number) => boolean) => {
    if (!validateStep(5)) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // Ensure storage is initialized before upload
      await initializeStorage();
      
      console.log("Uploading photos and medical reports...");
      
      toast({
        title: "Preparing Files",
        description: "Please wait while we prepare your submission...",
      });
      
      let photoUrls: string[] = [];
      let reportUrls: string[] = [];
      
      // Only attempt photo upload if there are photos
      if (formData.photos.length > 0) {
        const photoResult = await photoUploader.uploadFiles(formData.photos);
        if (photoResult.error) {
          throw photoResult.error;
        }
        photoUrls = photoResult.fileUrls;
        
        toast({
          title: "Photos Uploaded",
          description: `Successfully uploaded ${photoUrls.length} photos`,
        });
      }
      
      // Only attempt report upload if there are reports
      if (formData.medicalReports.length > 0) {
        const reportResult = await reportUploader.uploadFiles(formData.medicalReports);
        if (reportResult.error) {
          throw reportResult.error;
        }
        reportUrls = reportResult.fileUrls;
        
        toast({
          title: "Reports Uploaded",
          description: `Successfully uploaded ${reportUrls.length} reports`,
        });
      }
      
      console.log("Inserting health assessment");
      const { data, error } = await supabase
        .from('health_assessments')
        .insert([{
          user_id: user.id,
          full_name: formData.fullName,
          age: formData.age,
          height: formData.height,
          height_unit: formData.heightUnit,
          weight: formData.weight,
          weight_unit: formData.weightUnit,
          sex: formData.sex,
          city: formData.city,
          health_concerns: formData.healthConcerns,
          medical_conditions: formData.medicalConditions,
          other_condition: formData.otherCondition,
          diet_type: formData.dietType,
          wakeup_time: formData.wakeupTime,
          sleep_time: formData.sleepTime,
          profession: formData.profession,
          occupation: formData.occupation,
          leave_home_time: formData.leaveHomeTime,
          return_home_time: formData.returnHomeTime,
          break_times: formData.breakTimes,
          working_hours: formData.workingHours,
          meals: formData.meals,
          activities: formData.activities,
          photo_urls: photoUrls,
          medical_report_urls: reportUrls
        }]);
      
      if (error) {
        console.error("Health assessment insert error:", error);
        throw error;
      }
      
      toast({
        title: "Health Assessment Submitted",
        description: "Thank you for completing your health assessment. Your dietitian will review your information.",
      });
      
      navigate("/user/dashboard");
    } catch (error: any) {
      console.error("Error submitting health assessment:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting your health assessment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    handleSubmit,
    photoUploader,
    reportUploader
  };
};
