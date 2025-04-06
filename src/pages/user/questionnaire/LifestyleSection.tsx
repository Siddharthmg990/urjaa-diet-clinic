
import React from "react";
import { Label } from "@/components/ui/label";
import { TimeInput } from "@/components/TimeInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionnaireFormData } from "./types";

interface LifestyleSectionProps {
  formData: QuestionnaireFormData;
  handleChange: (field: string, value: any) => void;
  handleMealChange: (index: number, field: "time" | "description", value: string) => void;
  addMeal: () => void;
  removeMeal: (index: number) => void;
  errors: Record<string, string>;
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({
  formData,
  handleChange,
  handleMealChange,
  addMeal,
  removeMeal,
  errors
}) => {
  return (
    <>
      <div>
        <Label htmlFor="foodHabit" className="flex items-center mb-1">
          Food Habits <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select
          value={formData.foodHabit}
          onValueChange={(value) => handleChange("foodHabit", value)}
        >
          <SelectTrigger className={errors.foodHabit ? "border-red-500" : ""}>
            <SelectValue placeholder="Select your food habit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.foodHabit && (
          <p className="text-red-500 text-sm mt-1">{errors.foodHabit}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="wakeupTime" className="flex items-center mb-1">
            Wake-up Time <span className="text-red-500 ml-1">*</span>
          </Label>
          <TimeInput
            id="wakeupTime"
            value={formData.wakeupTime}
            onChange={(value) => handleChange("wakeupTime", value)}
            placeholder="HH:MM AM/PM"
          />
          {errors.wakeupTime && (
            <p className="text-red-500 text-sm mt-1">{errors.wakeupTime}</p>
          )}
        </div>
        <div>
          <Label htmlFor="sleepTime" className="flex items-center mb-1">
            Sleep Time <span className="text-red-500 ml-1">*</span>
          </Label>
          <TimeInput
            id="sleepTime"
            value={formData.sleepTime}
            onChange={(value) => handleChange("sleepTime", value)}
            placeholder="HH:MM AM/PM"
          />
          {errors.sleepTime && (
            <p className="text-red-500 text-sm mt-1">{errors.sleepTime}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center mb-1">
            Daily Meals <span className="text-red-500 ml-1">*</span>
          </Label>
          <Button 
            type="button" 
            size="sm" 
            onClick={addMeal} 
            variant="outline"
          >
            Add Meal
          </Button>
        </div>

        {errors.meals && (
          <p className="text-red-500 text-sm">{errors.meals}</p>
        )}

        {formData.meals.map((meal, index) => (
          <div key={index} className="grid grid-cols-[100px_1fr_auto] gap-2 items-start">
            <div>
              <TimeInput
                value={meal.time}
                onChange={(value) => handleMealChange(index, 'time', value)}
                placeholder="Time"
              />
            </div>
            <div>
              <Input
                value={meal.description}
                onChange={(e) => handleMealChange(index, 'description', e.target.value)}
                placeholder="Description (e.g., 1 cup of tea)"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeMeal(index)}
              disabled={formData.meals.length <= 1}
              className="mt-1"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="activityType" className="flex items-center mb-1">
            Type of Physical Activity <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="activityType"
            value={formData.activityType}
            onChange={(e) => handleChange("activityType", e.target.value)}
            placeholder="Yoga, Gym, Walk, etc."
            className={errors.activityType ? "border-red-500" : ""}
          />
          {errors.activityType && (
            <p className="text-red-500 text-sm mt-1">{errors.activityType}</p>
          )}
        </div>
        <div>
          <Label htmlFor="activityTime" className="flex items-center mb-1">
            Activity Time <span className="text-red-500 ml-1">*</span>
          </Label>
          <TimeInput
            id="activityTime"
            value={formData.activityTime}
            onChange={(value) => handleChange("activityTime", value)}
            placeholder="HH:MM AM/PM"
          />
          {errors.activityTime && (
            <p className="text-red-500 text-sm mt-1">{errors.activityTime}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="activityDuration" className="flex items-center mb-1">
          Activity Duration (in minutes) <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="activityDuration"
          type="text"
          inputMode="numeric"
          value={formData.activityDuration}
          onChange={(e) => handleChange("activityDuration", e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Duration in minutes"
          className={errors.activityDuration ? "border-red-500" : ""}
        />
        {errors.activityDuration && (
          <p className="text-red-500 text-sm mt-1">{errors.activityDuration}</p>
        )}
      </div>
    </>
  );
};
