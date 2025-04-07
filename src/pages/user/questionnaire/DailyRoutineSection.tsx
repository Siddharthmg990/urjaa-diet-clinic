
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TimeInput } from "@/components/TimeInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionnaireFormData } from "./types";

interface DailyRoutineSectionProps {
  formData: QuestionnaireFormData;
  handleChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export const DailyRoutineSection: React.FC<DailyRoutineSectionProps> = ({
  formData,
  handleChange,
  errors
}) => {
  const [showOccupation, setShowOccupation] = useState(false);
  
  // Show occupation field if profession is selected and not homemaker
  useEffect(() => {
    if (formData.profession && formData.profession !== "homemaker") {
      setShowOccupation(true);
    } else {
      setShowOccupation(false);
    }
  }, [formData.profession]);

  return (
    <>
      <div className="mt-4">
        <Label htmlFor="profession" className="flex items-center mb-1">
          Profession <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select
          value={formData.profession}
          onValueChange={(value) => handleChange("profession", value)}
        >
          <SelectTrigger className={errors.profession ? "border-red-500" : ""}>
            <SelectValue placeholder="Select your profession" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="working">Working Professional</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="homemaker">Homemaker</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.profession && (
          <p className="text-red-500 text-sm mt-1">{errors.profession}</p>
        )}
      </div>

      {showOccupation && (
        <div className="mt-4">
          <Label htmlFor="occupation" className="flex items-center mb-1">
            Occupation <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => handleChange("occupation", e.target.value)}
            placeholder="For e.g.: Software Engineer, Homemaker, etc."
            className={errors.occupation ? "border-red-500" : ""}
          />
          {errors.occupation && (
            <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>
          )}
        </div>
      )}

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

      {(formData.profession === "working" || formData.profession === "other" || formData.profession === "student") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="leaveHomeTime" className="flex items-center mb-1">
              What time do you leave home? <span className="text-red-500 ml-1">*</span>
            </Label>
            <TimeInput
              id="leaveHomeTime"
              value={formData.leaveHomeTime}
              onChange={(value) => handleChange("leaveHomeTime", value)}
              placeholder="HH:MM AM/PM"
            />
            {errors.leaveHomeTime && (
              <p className="text-red-500 text-sm mt-1">{errors.leaveHomeTime}</p>
            )}
          </div>
          <div>
            <Label htmlFor="returnHomeTime" className="flex items-center mb-1">
              What time do you return? <span className="text-red-500 ml-1">*</span>
            </Label>
            <TimeInput
              id="returnHomeTime"
              value={formData.returnHomeTime}
              onChange={(value) => handleChange("returnHomeTime", value)}
              placeholder="HH:MM AM/PM"
            />
            {errors.returnHomeTime && (
              <p className="text-red-500 text-sm mt-1">{errors.returnHomeTime}</p>
            )}
          </div>
        </div>
      )}

      {formData.profession === "student" && (
        <div className="mt-3">
          <Label htmlFor="breakTimes" className="flex items-center mb-1">
            What are your break/interval timings? <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="breakTimes"
            value={formData.breakTimes}
            onChange={(e) => handleChange("breakTimes", e.target.value)}
            placeholder="Ex: 11:00 AM - 11:15 AM, 1:00 PM - 1:45 PM"
            className={errors.breakTimes ? "border-red-500" : ""}
          />
          {errors.breakTimes && (
            <p className="text-red-500 text-sm mt-1">{errors.breakTimes}</p>
          )}
        </div>
      )}
    </>
  );
};
