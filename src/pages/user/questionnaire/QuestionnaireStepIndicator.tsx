
import React from "react";

interface QuestionnaireStepIndicatorProps {
  currentStep: number;
  goToStep: (step: number) => void;
  totalSteps: number;
}

export const QuestionnaireStepIndicator: React.FC<QuestionnaireStepIndicatorProps> = ({ 
  currentStep, 
  goToStep,
  totalSteps = 5 // Default to 5 steps
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-between items-center mb-8 bg-nourish-light p-3 rounded-lg">
      {steps.map((step) => (
        <button 
          key={step}
          onClick={() => step < currentStep ? goToStep(step) : undefined}
          className={`flex-1 flex flex-col items-center ${
            step <= currentStep ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          disabled={step > currentStep}
        >
          <div 
            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
              currentStep === step 
                ? "bg-nourish-primary text-white" 
                : currentStep > step 
                  ? "bg-nourish-light border-2 border-nourish-primary text-nourish-primary" 
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep > step ? "✓" : step}
          </div>
          <span className={`text-xs mt-1 hidden md:block ${
            currentStep >= step ? "text-nourish-primary" : "text-gray-400"
          }`}>
            {step === 1 && "Personal"}
            {step === 2 && "Medical"}
            {step === 3 && "Lifestyle"}
            {step === 4 && "Routine"}
            {step === 5 && "Documents"}
          </span>
        </button>
      ))}
    </div>
  );
};
