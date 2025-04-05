
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { QuestionnaireStepIndicator } from "./questionnaire/QuestionnaireStepIndicator";
import { PersonalInfoSection } from "./questionnaire/PersonalInfoSection";
import { MedicalSection } from "./questionnaire/MedicalSection";
import { LifestyleSection } from "./questionnaire/LifestyleSection";
import { WorkPhotoSection } from "./questionnaire/WorkPhotoSection";
import { QuestionnaireFormData } from "./questionnaire/types";

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireFormData>({
    // Personal Information
    fullName: "",
    age: "",
    height: "",
    heightUnit: "feet", // Default to feet
    weight: "",
    weightUnit: "kg", // Default to kg
    sex: "",
    workingHours: { start: "", end: "" },
    
    // Medical Information
    healthConcerns: "",
    medicalConditions: [] as string[],
    otherCondition: "",
    
    // Lifestyle Information
    foodHabit: "",
    wakeupTime: "",
    sleepTime: "",
    meals: [{ time: "", description: "" }],
    
    // Physical Activity
    activityType: "",
    activityTime: "",
    activityDuration: "",
    
    // Work & Study
    profession: "",
    leaveHomeTime: "",
    returnHomeTime: "",
    breakTimes: "",
    
    // Photos
    photos: [] as File[],
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const addMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, { time: "", description: "" }]
    }));
  };

  const removeMeal = (index: number) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals.splice(index, 1);
      return { ...prev, meals: updatedMeals.length ? updatedMeals : [{ time: "", description: "" }] };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...filesArray]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => {
      const updatedPhotos = [...prev.photos];
      updatedPhotos.splice(index, 1);
      return { ...prev, photos: updatedPhotos };
    });
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  // Function for direct navigation to a step
  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    // In a real app, submit data to backend
    console.log("Form submitted:", formData);
    toast({
      title: "Health Assessment Submitted",
      description: "Thank you for completing your health assessment. Your dietitian will review your information.",
    });
    navigate("/user/dashboard");
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
              />
            </CardContent>
          </>
        );
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Lifestyle & Daily Routine</CardTitle>
              <CardDescription>
                Tell us about your daily habits and lifestyle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LifestyleSection 
                formData={formData} 
                handleChange={handleChange}
                handleMealChange={handleMealChange}
                addMeal={addMeal}
                removeMeal={removeMeal}
              />
            </CardContent>
          </>
        );
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle>Work Schedule & Photos</CardTitle>
              <CardDescription>
                Tell us about your work schedule and upload photos if you'd like
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <WorkPhotoSection 
                formData={formData} 
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                removePhoto={removePhoto}
              />
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-nourish-dark mb-2">Health Assessment</h1>
      <p className="text-gray-600 mb-6">
        Complete this questionnaire to help us create your personalized nutrition plan.
      </p>

      <QuestionnaireStepIndicator currentStep={currentStep} goToStep={goToStep} />

      <Card>
        {renderCurrentSection()}
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Questionnaire;
