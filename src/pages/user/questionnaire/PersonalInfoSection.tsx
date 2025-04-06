
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeInput } from "@/components/TimeInput";
import { QuestionnaireFormData } from "./types";

interface PersonalInfoSectionProps {
  formData: QuestionnaireFormData;
  handleChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  formData, 
  handleChange,
  errors
}) => {
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow positive numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    handleChange("age", value);
  };

  return (
    <>
      <div>
        <Label htmlFor="fullName" className="flex items-center">
          Full Name <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Enter your full name"
          required
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age" className="flex items-center">
            Age <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="age"
            type="text"
            inputMode="numeric"
            value={formData.age}
            onChange={handleAgeChange}
            placeholder="Years"
            required
            className={errors.age ? "border-red-500" : ""}
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age}</p>
          )}
        </div>
        
        <div>
          <Label className="flex items-center">
            Sex <span className="text-red-500 ml-1">*</span>
          </Label>
          <RadioGroup
            value={formData.sex}
            onValueChange={(value) => handleChange("sex", value)}
            className="flex gap-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
          {errors.sex && (
            <p className="text-red-500 text-sm mt-1">{errors.sex}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height" className="flex items-center">
            Height <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id="height"
              value={formData.height}
              onChange={(e) => handleChange("height", e.target.value)}
              placeholder="Enter your height"
              className={`flex-1 ${errors.height ? "border-red-500" : ""}`}
              required
            />
            <Select 
              value={formData.heightUnit}
              onValueChange={(value) => handleChange("heightUnit", value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feet">ft/in</SelectItem>
                <SelectItem value="cm">cm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.height && (
            <p className="text-red-500 text-sm mt-1">{errors.height}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="weight" className="flex items-center">
            Weight <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              placeholder="Enter your weight"
              className={`flex-1 ${errors.weight ? "border-red-500" : ""}`}
              required
            />
            <Select 
              value={formData.weightUnit}
              onValueChange={(value) => handleChange("weightUnit", value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lbs">lbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Working Hours (If applicable)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="workStart" className="text-sm text-muted-foreground">Start Time</Label>
            <TimeInput
              id="workStart"
              value={formData.workingHours.start}
              onChange={(value) => handleChange("workingHours", { ...formData.workingHours, start: value })}
              placeholder="HH:MM AM/PM"
            />
          </div>
          <div>
            <Label htmlFor="workEnd" className="text-sm text-muted-foreground">End Time</Label>
            <TimeInput
              id="workEnd"
              value={formData.workingHours.end}
              onChange={(value) => handleChange("workingHours", { ...formData.workingHours, end: value })}
              placeholder="HH:MM AM/PM"
            />
          </div>
        </div>
      </div>
    </>
  );
};
