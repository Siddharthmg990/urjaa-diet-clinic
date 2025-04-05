
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Upload } from "lucide-react";
import { TimeInput } from "@/components/TimeInput";

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    age: "",
    height: "",
    weight: "",
    sex: "",
    workingHours: { start: "", end: "" },
    
    // Medical Information
    healthConcerns: "",
    medicalConditions: [] as string[],
    otherCondition: "",
    
    // Lifestyle Information
    foodHabit: "",
    wakeupTime: "",
    sleepTime: "",
    meals: [{ time: "", description: "" }],
    
    // Physical Activity
    activityType: "",
    activityTime: "",
    activityDuration: "",
    
    // Work & Study
    profession: "",
    leaveHomeTime: "",
    returnHomeTime: "",
    breakTimes: "",
    
    // Photos
    photos: [] as File[],
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => {
      const currentValues = [...prev.medicalConditions];
      if (currentValues.includes(value)) {
        return { ...prev, medicalConditions: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, medicalConditions: [...currentValues, value] };
      }
    });
  };

  const handleMealChange = (index: number, field: 'time' | 'description', value: string) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals[index] = { ...updatedMeals[index], [field]: value };
      return { ...prev, meals: updatedMeals };
    });
  };

  const addMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, { time: "", description: "" }]
    }));
  };

  const removeMeal = (index: number) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals.splice(index, 1);
      return { ...prev, meals: updatedMeals.length ? updatedMeals : [{ time: "", description: "" }] };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...filesArray]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => {
      const updatedPhotos = [...prev.photos];
      updatedPhotos.splice(index, 1);
      return { ...prev, photos: updatedPhotos };
    });
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    // In a real app, submit data to backend
    console.log("Form submitted:", formData);
    toast({
      title: "Health Assessment Submitted",
      description: "Thank you for completing your health assessment. Your dietitian will review your information.",
    });
    navigate("/user/dashboard");
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between items-center mb-8 bg-nourish-light p-3 rounded-lg">
        {[1, 2, 3, 4].map((step) => (
          <div 
            key={step}
            className={`flex-1 text-center ${
              currentStep === step 
                ? "text-nourish-primary font-bold" 
                : currentStep > step 
                  ? "text-nourish-primary" 
                  : "text-gray-400"
            }`}
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
              {step === 4 && "Work & Photos"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-nourish-dark mb-2">Health Assessment</h1>
      <p className="text-gray-600 mb-6">
        Complete this questionnaire to help us create your personalized nutrition plan.
      </p>

      {renderStepIndicator()}

      <Card>
        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Let's start with some basic information about you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Input
                    id="height"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    placeholder="cm or ft/in"
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    placeholder="kg or lbs"
                  />
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
            </CardContent>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>
                Please tell us about any health conditions or concerns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="healthConcerns">Please describe any current health concerns or complaints in detail:</Label>
                <Textarea
                  id="healthConcerns"
                  value={formData.healthConcerns}
                  onChange={(e) => handleChange("healthConcerns", e.target.value)}
                  placeholder="Enter your health concerns here"
                  rows={4}
                />
              </div>

              <div>
                <Label className="mb-2 block">Do you have any of the following conditions?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {["High Blood Pressure (BP)", "Diabetes", "High Cholesterol", "Asthma", "Hypothyroidism", "Acidity", "Constipation"].map((condition) => (
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
            </CardContent>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle>Lifestyle & Daily Routine</CardTitle>
              <CardDescription>
                Tell us about your daily habits and lifestyle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </>
        )}

        {currentStep === 4 && (
          <>
            <CardHeader>
              <CardTitle>Work Schedule & Photos</CardTitle>
              <CardDescription>
                Tell us about your work schedule and upload photos if you'd like
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profession">Profession</Label>
                <Select 
                  value={formData.profession}
                  onValueChange={(value) => handleChange("profession", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="working">Working Professional</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.profession === "working" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="leaveHomeTime">What time do you leave home?</Label>
                    <TimeInput
                      id="leaveHomeTime"
                      value={formData.leaveHomeTime}
                      onChange={(value) => handleChange("leaveHomeTime", value)}
                      placeholder="HH:MM AM/PM"
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnHomeTime">What time do you return?</Label>
                    <TimeInput
                      id="returnHomeTime"
                      value={formData.returnHomeTime}
                      onChange={(value) => handleChange("returnHomeTime", value)}
                      placeholder="HH:MM AM/PM"
                    />
                  </div>
                </div>
              )}

              {formData.profession === "student" && (
                <div>
                  <Label htmlFor="breakTimes">What are your break/interval timings?</Label>
                  <Textarea
                    id="breakTimes"
                    value={formData.breakTimes}
                    onChange={(e) => handleChange("breakTimes", e.target.value)}
                    placeholder="Specify all break times during school/college"
                    rows={3}
                  />
                </div>
              )}

              <div>
                <Label className="mb-2 block">Photo Submission (Optional but recommended)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Please upload 3 standing photos (Front, Side, Back) and 1 close-up of your face.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <Label 
                    htmlFor="photoUpload" 
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload photos</p>
                      <p className="text-xs text-gray-400">Front, Side, Back and Face</p>
                    </div>
                    <Input 
                      id="photoUpload" 
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>

                {formData.photos.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Uploaded Photos</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={URL.createObjectURL(photo)} 
                            alt={`Uploaded photo ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-5 w-5 rounded-full"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Questionnaire;
