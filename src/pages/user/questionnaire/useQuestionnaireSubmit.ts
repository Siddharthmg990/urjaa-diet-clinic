
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionnaireFormData } from "./types";
import { useFileUpload } from "@/hooks/use-file-upload";

export const useQuestionnaireSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Simpler file upload configuration
  const photoUploader = useFileUpload({
    userId: user?.id || '',
    bucketName: 'user_uploads',
    isPublic: false
  });

  const reportUploader = useFileUpload({
    userId: user?.id || '',
    bucketName: 'user_uploads',
    isPublic: false
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
      
      toast({
        title: "Starting Submission",
        description: "Preparing your health assessment...",
      });
      
      let photoUrls: string[] = [];
      let reportUrls: string[] = [];
      
      // Only attempt photo upload if there are photos
      if (formData.photos.length > 0) {
        toast({
          title: "Uploading Photos",
          description: "Please wait...",
        });
        
        const photoResult = await photoUploader.uploadFiles(formData.photos);
        
        if (photoResult.error) {
          console.error("Photo upload error:", photoResult.error);
          throw new Error(`Photo upload failed: ${photoResult.error.message}`);
        }
        
        photoUrls = photoResult.fileUrls;
        
        if (photoUrls.length > 0) {
          toast({
            title: "Photos Uploaded",
            description: `Successfully uploaded ${photoUrls.length} photos`,
          });
        } else {
          console.warn("No photo URLs returned despite successful upload");
        }
      }
      
      // Only attempt report upload if there are reports
      if (formData.medicalReports.length > 0) {
        toast({
          title: "Uploading Reports",
          description: "Please wait...",
        });
        
        const reportResult = await reportUploader.uploadFiles(formData.medicalReports);
        
        if (reportResult.error) {
          console.error("Report upload error:", reportResult.error);
          throw new Error(`Medical report upload failed: ${reportResult.error.message}`);
        }
        
        reportUrls = reportResult.fileUrls;
        
        if (reportUrls.length > 0) {
          toast({
            title: "Reports Uploaded",
            description: `Successfully uploaded ${reportUrls.length} reports`,
          });
        }
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
        }])
        .select();
      
      if (error) {
        console.error("Health assessment insert error:", error);
        throw new Error(`Database error: ${error.message}`);
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
