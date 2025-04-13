
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionnaireFormData } from "./types";
import { useFileUpload } from "@/hooks/use-file-upload";
import apiClient from "@/api/client";

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
      
      // Initialize storage before upload
      await apiClient.post('/storage/initialize');
      
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
      
      console.log("Submitting health assessment");
      
      // Submit health assessment via API
      const { data } = await apiClient.post('/health-assessment', {
        user_id: user.id,
        fullName: formData.fullName,
        age: formData.age,
        height: formData.height,
        heightUnit: formData.heightUnit,
        weight: formData.weight,
        weightUnit: formData.weightUnit,
        sex: formData.sex,
        city: formData.city,
        healthConcerns: formData.healthConcerns,
        medicalConditions: formData.medicalConditions,
        otherCondition: formData.otherCondition,
        dietType: formData.dietType,
        wakeupTime: formData.wakeupTime,
        sleepTime: formData.sleepTime,
        profession: formData.profession,
        occupation: formData.occupation,
        leaveHomeTime: formData.leaveHomeTime,
        returnHomeTime: formData.returnHomeTime,
        breakTimes: formData.breakTimes,
        workingHours: formData.workingHours,
        meals: formData.meals,
        activities: formData.activities,
        photo_urls: photoUrls,
        medical_report_urls: reportUrls
      });
      
      if (data.error) {
        throw new Error(data.error);
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
