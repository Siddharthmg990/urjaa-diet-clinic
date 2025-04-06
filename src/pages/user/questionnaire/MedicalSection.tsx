
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionnaireFormData } from "./types";

interface MedicalSectionProps {
  formData: QuestionnaireFormData;
  handleChange: (field: string, value: any) => void;
  handleCheckboxChange: (value: string) => void;
  errors: Record<string, string>;
}

export const MedicalSection: React.FC<MedicalSectionProps> = ({ 
  formData, 
  handleChange, 
  handleCheckboxChange,
  errors
}) => {
  const medicalConditions = [
    "High Blood Pressure (BP)", 
    "Diabetes", 
    "High Cholesterol", 
    "Asthma", 
    "Hypothyroidism", 
    "Acidity", 
    "Constipation"
  ];

  return (
    <>
      <div>
        <Label htmlFor="healthConcerns" className="flex items-center mb-1">
          Please describe any current health concerns or complaints in detail: <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="healthConcerns"
          value={formData.healthConcerns}
          onChange={(e) => handleChange("healthConcerns", e.target.value)}
          placeholder="For Instance:
Low back pain since 2019
Facial acne since Jan 2025"
          rows={4}
          required
          className={errors.healthConcerns ? "border-red-500" : ""}
        />
        {errors.healthConcerns && (
          <p className="text-red-500 text-sm mt-1">{errors.healthConcerns}</p>
        )}
      </div>

      <div className="mt-4">
        <Label className="mb-2 block">Do you have any of the following conditions?</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {medicalConditions.map((condition) => (
            <div className="flex items-center space-x-2" key={condition}>
              <Checkbox
                id={condition}
                checked={formData.medicalConditions.includes(condition)}
                onCheckedChange={() => handleCheckboxChange(condition)}
              />
              <Label htmlFor={condition} className="text-sm">{condition}</Label>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="otherCondition"
              checked={formData.medicalConditions.includes("Other")}
              onCheckedChange={() => handleCheckboxChange("Other")}
            />
            <Label htmlFor="otherCondition" className="text-sm">Other (please specify)</Label>
          </div>
          {formData.medicalConditions.includes("Other") && (
            <Input
              className="mt-2"
              value={formData.otherCondition}
              onChange={(e) => handleChange("otherCondition", e.target.value)}
              placeholder="Please specify other condition"
            />
          )}
        </div>
      </div>
    </>
  );
};
