
import React from "react";
import { Label } from "@/components/ui/label";
import { TimeInput } from "@/components/TimeInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionnaireFormData } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

interface LifestyleSectionProps {
  formData: QuestionnaireFormData;
  handleChange: (field: string, value: any) => void;
  handleMealChange: (index: number, field: "time" | "description", value: string) => void;
  addMeal: () => void;
  removeMeal: (index: number) => void;
  handleActivityChange: (index: number, field: "type" | "time" | "duration", value: string) => void;
  addActivity: () => void;
  removeActivity: (index: number) => void;
  errors: Record<string, string>;
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({
  formData,
  handleChange,
  handleMealChange,
  addMeal,
  removeMeal,
  handleActivityChange,
  addActivity,
  removeActivity,
  errors
}) => {
  // Use fixed array for duration options
  const durationOptions = ["15", "30", "45", "60", "75", "90", "105", "120", "135"];
  
  const [noActivity, setNoActivity] = React.useState(false);
  
  // Handle no physical activity checkbox
  const handleNoActivityChange = (checked: boolean) => {
    setNoActivity(checked);
    
    if (checked) {
      // Clear activities and add a placeholder activity with "None" type
      handleChange("activities", [{ type: "None", time: "", duration: "0" }]);
    } else {
      // Reset to default activity input
      handleChange("activities", [{ type: "", time: "", duration: "" }]);
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="dietType" className="flex items-center mb-1">
          Diet Type <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select
          value={formData.dietType}
          onValueChange={(value) => handleChange("dietType", value)}
        >
          <SelectTrigger className={errors.dietType ? "border-red-500" : ""}>
            <SelectValue placeholder="Select your diet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.dietType && (
          <p className="text-red-500 text-sm mt-1">{errors.dietType}</p>
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

        <div className="bg-slate-50 p-3 rounded-md mb-2 text-sm text-gray-600">
          For e.g.:<br />
          8am - 1 cup tea<br />
          9am - 1 dosa with sambar
        </div>

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

      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center mb-1">
            Physical Activities <span className="text-red-500 ml-1">*</span>
          </Label>
          <Button 
            type="button" 
            size="sm" 
            onClick={addActivity} 
            variant="outline"
            disabled={formData.activities.length >= 2 || noActivity}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Activity
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="no-activity" 
            checked={noActivity}
            onCheckedChange={handleNoActivityChange}
          />
          <Label htmlFor="no-activity" className="text-sm font-normal cursor-pointer">
            I don't do any physical activity
          </Label>
        </div>

        {errors.activities && (
          <p className="text-red-500 text-sm">{errors.activities}</p>
        )}

        {!noActivity && formData.activities.map((activity, index) => (
          <div key={index} className="border rounded-md p-3 space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-medium">Activity {index + 1}</Label>
              {formData.activities.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeActivity(index)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor={`activityType-${index}`} className="flex items-center mb-1">
                  Type <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id={`activityType-${index}`}
                  value={activity.type}
                  onChange={(e) => handleActivityChange(index, "type", e.target.value)}
                  placeholder="Yoga, Gym, Walk, etc."
                  className={errors[`activities.${index}.type`] ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label htmlFor={`activityTime-${index}`} className="flex items-center mb-1">
                  Time <span className="text-red-500 ml-1">*</span>
                </Label>
                <TimeInput
                  id={`activityTime-${index}`}
                  value={activity.time}
                  onChange={(value) => handleActivityChange(index, "time", value)}
                  placeholder="HH:MM AM/PM"
                />
              </div>
              <div>
                <Label htmlFor={`activityDuration-${index}`} className="flex items-center mb-1">
                  Duration (mins) <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={activity.duration}
                  onValueChange={(value) => handleActivityChange(index, "duration", value)}
                >
                  <SelectTrigger className={errors[`activities.${index}.duration`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map(duration => (
                      <SelectItem key={duration} value={duration}>{duration} minutes</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        
        {noActivity && (
          <div className="flex items-center p-3 bg-slate-50 rounded-md">
            <Activity className="h-5 w-5 text-slate-400 mr-2" />
            <span className="text-slate-500">No physical activity selected</span>
          </div>
        )}
      </div>
    </>
  );
};
