
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeInput } from "@/components/TimeInput";
import { QuestionnaireFormData } from "./types";

interface LifestyleSectionProps {
  formData: QuestionnaireFormData;
  handleChange: (field: string, value: any) => void;
  handleMealChange: (index: number, field: 'time' | 'description', value: string) => void;
  addMeal: () => void;
  removeMeal: (index: number) => void;
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({ 
  formData, 
  handleChange, 
  handleMealChange, 
  addMeal, 
  removeMeal 
}) => {
  return (
    <>
      <div>
        <Label htmlFor="foodHabit">Food Habits</Label>
        <Select 
          value={formData.foodHabit}
          onValueChange={(value) => handleChange("foodHabit", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your food habit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {formData.foodHabit === "other" && (
          <Input
            className="mt-2"
            placeholder="Please specify your food habit"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="wakeupTime">What time do you wake up?</Label>
          <TimeInput
            id="wakeupTime"
            value={formData.wakeupTime}
            onChange={(value) => handleChange("wakeupTime", value)}
            placeholder="HH:MM AM/PM"
          />
        </div>
        
        <div>
          <Label htmlFor="sleepTime">What time do you go to sleep?</Label>
          <TimeInput
            id="sleepTime"
            value={formData.sleepTime}
            onChange={(value) => handleChange("sleepTime", value)}
            placeholder="HH:MM AM/PM"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Daily Meal Timings & Quantity</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addMeal}
          >
            Add Meal
          </Button>
        </div>
        <div className="space-y-3">
          {formData.meals.map((meal, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <TimeInput
                  value={meal.time}
                  onChange={(value) => handleMealChange(index, 'time', value)}
                  placeholder="Time"
                />
              </div>
              <div className="flex-[3]">
                <Input
                  value={meal.description}
                  onChange={(e) => handleMealChange(index, 'description', e.target.value)}
                  placeholder="Meal description (e.g. 1 cup Tea)"
                />
              </div>
              {formData.meals.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeMeal(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Example: 6:00 AM - 1 cup Tea, 8:00 AM - 1 Dosa with Sambar</p>
      </div>

      <div>
        <Label className="mb-2 block">Physical Activity</Label>
        <div className="space-y-3">
          <div>
            <Label htmlFor="activityType" className="text-sm text-muted-foreground">Type of Activity</Label>
            <Input 
              id="activityType"
              value={formData.activityType} 
              onChange={(e) => handleChange("activityType", e.target.value)}
              placeholder="Yoga, Gym, Walk, etc."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label htmlFor="activityTime" className="text-sm text-muted-foreground">Time</Label>
              <TimeInput
                id="activityTime"
                value={formData.activityTime}
                onChange={(value) => handleChange("activityTime", value)}
                placeholder="HH:MM AM/PM"
              />
            </div>
            <div>
              <Label htmlFor="activityDuration" className="text-sm text-muted-foreground">Duration (minutes)</Label>
              <Input
                id="activityDuration"
                type="number"
                value={formData.activityDuration}
                onChange={(e) => handleChange("activityDuration", e.target.value)}
                placeholder="Duration in minutes"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
