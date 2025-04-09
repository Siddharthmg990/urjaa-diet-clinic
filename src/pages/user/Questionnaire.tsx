import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase, initializeStorage } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFileUpload } from "@/hooks/use-file-upload";

import { QuestionnaireStepIndicator } from "./questionnaire/QuestionnaireStepIndicator";
import { PersonalInfoSection } from "./questionnaire/PersonalInfoSection";
import { MedicalSection } from "./questionnaire/MedicalSection";
import { LifestyleSection } from "./questionnaire/LifestyleSection";
import { DailyRoutineSection } from "./questionnaire/DailyRoutineSection";
import { DocumentsReportsSection } from "./questionnaire/DocumentsReportsSection";
import { QuestionnaireFormData } from "./questionnaire/types";
import { useIsMobile } from "@/hooks/use-mobile";

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isStorageInitializing, setIsStorageInitializing] = useState(false);
  const [formData, setFormData] = useState<QuestionnaireFormData>({
    fullName: "",
    age: "",
    height: "",
    heightUnit: "feet",
    weight: "",
    weightUnit: "kg",
    sex: "",
    city: "",
    workingHours: { start: "", end: "" },
    healthConcerns: "",
    medicalConditions: [] as string[],
    otherCondition: "",
    dietType: "",
    wakeupTime: "",
    sleepTime: "",
    meals: [{ time: "", description: "" }],
    profession: "",
    occupation: "",
    leaveHomeTime: "",
    returnHomeTime: "",
    breakTimes: "",
    activities: [{ 
      type: "",
      time: "",
      duration: ""
    }],
    photos: [] as File[],
    medicalReports: [] as File[],
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    const setupStorage = async () => {
      if (!user?.id) return;
      
      setIsStorageInitializing(true);
      try {
        console.log("Initializing storage from Questionnaire component...");
        await initializeStorage();
      } catch (error) {
        console.error("Storage initialization error:", error);
      } finally {
        setIsStorageInitializing(false);
      }
    };
    
    if (user?.id) {
      setupStorage();
    }
  }, [user?.id]);

  const photoUploader = useFileUpload({
    userId: user?.id || '',
    bucketName: 'health_photos',
    fallbackBucket: 'images'
  });

  const reportUploader = useFileUpload({
    userId: user?.id || '',
    bucketName: 'medical_reports',
    fallbackBucket: 'images'
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field] && value) {
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors[field];
        return updatedErrors;
      });
    }
  };

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => {
      const currentValues = [...prev.medicalConditions];
      if (currentValues.includes(value)) {
        return { ...prev, medicalConditions: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, medicalConditions: [...currentValues, value] };
      }
    });
  };

  const handleMealChange = (index: number, field: 'time' | 'description', value: string) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals[index] = { ...updatedMeals[index], [field]: value };
      return { ...prev, meals: updatedMeals };
    });
  };

  const handleActivityChange = (index: number, field: 'type' | 'time' | 'duration', value: string) => {
    setFormData(prev => {
      const updatedActivities = [...prev.activities];
      updatedActivities[index] = { ...updatedActivities[index], [field]: value };
      return { ...prev, activities: updatedActivities };
    });
  };

  const addMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, { time: "", description: "" }]
    }));
  };

  const addActivity = () => {
    if (formData.activities.length < 2) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, { type: "", time: "", duration: "" }]
      }));
    }
  };

  const removeMeal = (index: number) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals.splice(index, 1);
      return { ...prev, meals: updatedMeals.length ? updatedMeals : [{ time: "", description: "" }] };
    });
  };

  const removeActivity = (index: number) => {
    setFormData(prev => {
      const updatedActivities = [...prev.activities];
      updatedActivities.splice(index, 1);
      return { ...prev, activities: updatedActivities.length ? updatedActivities : [{ type: "", time: "", duration: "" }] };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: "photos" | "medicalReports") => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setFormData(prev => ({
        ...prev,
        [fileType]: [...prev[fileType], ...filesArray]
      }));

      if (errors[fileType] && filesArray.length > 0) {
        setErrors(prev => {
          const updatedErrors = { ...prev };
          delete updatedErrors[fileType];
          return updatedErrors;
        });
      }
    }
  };

  const removeFile = (index: number, fileType: "photos" | "medicalReports") => {
    setFormData(prev => {
      const updatedFiles = [...prev[fileType]];
      updatedFiles.splice(index, 1);
      return { ...prev, [fileType]: updatedFiles };
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.city) {
        newErrors.city = "City is required";
      }
      if (!formData.age) {
        newErrors.age = "Age is required";
      }
      if (!formData.height.trim()) {
        newErrors.height = "Height is required";
      }
      if (!formData.weight.trim()) {
        newErrors.weight = "Weight is required";
      }
      if (!formData.sex) {
        newErrors.sex = "Sex is required";
      }
    } else if (step === 2) {
      if (!formData.healthConcerns.trim()) {
        newErrors.healthConcerns = "Health concerns are required";
      }
    } else if (step === 3) {
      if (!formData.profession) {
        newErrors.profession = "Profession is required";
      }
      
      if (formData.profession && formData.profession !== "homemaker" && !formData.occupation) {
        newErrors.occupation = "Occupation is required";
      }
      
      if (formData.profession === "working" || formData.profession === "other" || formData.profession === "student") {
        if (!formData.leaveHomeTime) {
          newErrors.leaveHomeTime = "Leave home time is required";
        }
        if (!formData.returnHomeTime) {
          newErrors.returnHomeTime = "Return home time is required";
        }
      }
      
      if (formData.profession === "student" && !formData.breakTimes) {
        newErrors.breakTimes = "Break times are required";
      }
    } else if (step === 4) {
      if (!formData.dietType.trim()) {
        newErrors.dietType = "Diet type is required";
      }
      if (!formData.wakeupTime.trim()) {
        newErrors.wakeupTime = "Wake up time is required";
      }
      if (!formData.sleepTime.trim()) {
        newErrors.sleepTime = "Sleep time is required";
      }
      if (!formData.meals[0].time || !formData.meals[0].description) {
        newErrors.meals = "At least one meal is required";
      }
      
      if (formData.activities.length > 0 && formData.activities[0].type !== "None") {
        formData.activities.forEach((activity, index) => {
          if (!activity.type) {
            newErrors[`activities.${index}.type`] = "Activity type is required";
          }
          if (!activity.time) {
            newErrors[`activities.${index}.time`] = "Activity time is required";
          }
          if (!activity.duration) {
            newErrors[`activities.${index}.duration`] = "Activity duration is required";
          }
        });
      }
    } else if (step === 5) {
      if (formData.photos.length === 0) {
        newErrors.photos = "At least one photo is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const navigateBack = () => {
    navigate("/user/dashboard");
  };

  const goToStep = useCallback((step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      await initializeStorage();
      
      console.log("Uploading photos and medical reports...");
      
      toast({
        title: "Uploading Files",
        description: "Please wait while your files are being uploaded...",
      });
      
      const { fileUrls: photoUrls, error: photoError } = await photoUploader.uploadFiles(formData.photos);
      if (photoError) {
        throw photoError;
      }
      
      const { fileUrls: reportUrls, error: reportError } = await reportUploader.uploadFiles(formData.medicalReports);
      if (reportError) {
        throw reportError;
      }
      
      toast({
        title: "Files Uploaded",
        description: "Your files have been uploaded successfully.",
      });
      
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

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Let's start with some basic information about you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PersonalInfoSection 
                formData={formData} 
                handleChange={handleChange} 
                errors={errors}
              />
            </CardContent>
          </>
        );
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>
                Please tell us about any health conditions or concerns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MedicalSection 
                formData={formData} 
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                errors={errors}
              />
            </CardContent>
          </>
        );
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Occupation</CardTitle>
              <CardDescription>
                Tell us about your work and daily schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DailyRoutineSection
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            </CardContent>
          </>
        );
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle>Lifestyle & Eating Habits</CardTitle>
              <CardDescription>
                Tell us about your diet and daily habits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LifestyleSection 
                formData={formData} 
                handleChange={handleChange}
                handleMealChange={handleMealChange}
                addMeal={addMeal}
                removeMeal={removeMeal}
                handleActivityChange={handleActivityChange}
                addActivity={addActivity}
                removeActivity={removeActivity}
                errors={errors}
              />
            </CardContent>
          </>
        );
      case 5:
        return (
          <>
            <CardHeader>
              <CardTitle>Documents & Reports</CardTitle>
              <CardDescription>
                Upload photos and medical reports for a comprehensive assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DocumentsReportsSection 
                formData={formData}
                handleFileChange={handleFileChange}
                removeFile={removeFile}
                errors={errors}
                storageStatus={{
                  isBucketReady: photoUploader.isBucketReady && reportUploader.isBucketReady,
                  activeBucket: photoUploader.activeBucket
                }}
              />
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`max-w-2xl mx-auto pb-12 px-4 ${isMobile ? 'pt-4' : 'pt-0'}`}>
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm"
          className="mr-2"
          onClick={navigateBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-nourish-dark mb-2">Health Assessment</h1>
      <p className="text-gray-600 mb-6">
        Complete this questionnaire to help us create your personalized nutrition plan.
      </p>

      {isStorageInitializing && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
          <p className="text-amber-700 text-sm">
            Storage system is initializing. Please wait a moment before proceeding to file uploads.
          </p>
        </div>
      )}

      <QuestionnaireStepIndicator currentStep={currentStep} goToStep={goToStep} totalSteps={5} />

      <Card className="mt-6">
        {renderCurrentSection()}
        
        <CardFooter className={`flex justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={isMobile ? "w-full" : ""}
          >
            Previous
          </Button>
          
          {currentStep < 5 ? (
            <Button 
              onClick={handleNext}
              className={isMobile ? "w-full" : ""}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className={isMobile ? "w-full" : ""}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Questionnaire;
