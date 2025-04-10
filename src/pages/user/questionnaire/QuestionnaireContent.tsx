
import React from "react";
import { 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { MedicalSection } from "./MedicalSection";
import { DailyRoutineSection } from "./DailyRoutineSection";
import { LifestyleSection } from "./LifestyleSection";
import { DocumentsReportsSection } from "./DocumentsReportsSection";
import { QuestionnaireFormData } from "./types";

interface QuestionnaireContentProps {
  currentStep: number;
  formData: QuestionnaireFormData;
  handleChange: (field: string, value: any) => void;
  handleCheckboxChange: (value: string) => void;
  handleMealChange: (index: number, field: "time" | "description", value: string) => void;
  addMeal: () => void;
  removeMeal: (index: number) => void;
  handleActivityChange: (index: number, field: "type" | "time" | "duration", value: string) => void;
  addActivity: () => void;
  removeActivity: (index: number) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileType: "photos" | "medicalReports") => void;
  removeFile: (index: number, fileType: "photos" | "medicalReports") => void;
  errors: Record<string, string>;
  photoUploader: any;
  reportUploader: any;
}

export const QuestionnaireContent: React.FC<QuestionnaireContentProps> = ({
  currentStep,
  formData,
  handleChange,
  handleCheckboxChange,
  handleMealChange,
  addMeal,
  removeMeal,
  handleActivityChange,
  addActivity,
  removeActivity,
  handleFileChange,
  removeFile,
  errors,
  photoUploader,
  reportUploader
}) => {
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
