
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
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  formData, 
  handleChange 
}) => {
  return (
    <>
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="Years"
          />
        </div>
        
        <div>
          <Label>Sex</Label>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height">Height</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="height"
              value={formData.height}
              onChange={(e) => handleChange("height", e.target.value)}
              placeholder="Enter your height"
              className="flex-1"
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
        </div>
        
        <div>
          <Label htmlFor="weight">Weight</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              placeholder="Enter your weight"
              className="flex-1"
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
