
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";
import { supabase, initializeStorage } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

import { QuestionnaireStepIndicator } from "./questionnaire/QuestionnaireStepIndicator";
import { QuestionnaireContent } from "./questionnaire/QuestionnaireContent";
import { useQuestionnaireForm } from "./questionnaire/useQuestionnaireForm";
import { useQuestionnaireSubmit } from "./questionnaire/useQuestionnaireSubmit";

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isStorageInitializing, setIsStorageInitializing] = useState(false);
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // Custom hooks for form and submission handling
  const {
    formData,
    errors,
    handleChange,
    handleCheckboxChange,
    handleMealChange,
    handleActivityChange,
    addMeal,
    addActivity,
    removeMeal,
    removeActivity,
    handleFileChange,
    removeFile,
    validateStep
  } = useQuestionnaireForm();
  
  const {
    isLoading,
    handleSubmit,
    photoUploader,
    reportUploader
  } = useQuestionnaireSubmit();

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
        <QuestionnaireContent
          currentStep={currentStep}
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
          handleMealChange={handleMealChange}
          addMeal={addMeal}
          removeMeal={removeMeal}
          handleActivityChange={handleActivityChange}
          addActivity={addActivity}
          removeActivity={removeActivity}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
          errors={errors}
          photoUploader={photoUploader}
          reportUploader={reportUploader}
        />
        
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
              onClick={() => handleSubmit(formData, validateStep)}
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
