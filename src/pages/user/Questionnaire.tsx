
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

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    
    // Health Information
    medicalConditions: [] as string[],
    allergies: [] as string[],
    medications: "",
    
    // Dietary Information
    dietType: "",
    mealFrequency: "",
    waterIntake: "",
    foodPreferences: "",
    foodDislikes: "",
    
    // Goals
    healthGoal: "",
    targetWeight: "",
    timeframe: "",
    additionalInfo: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (value: string, field: "medicalConditions" | "allergies") => {
    setFormData((prev) => {
      const currentValues = [...prev[field]];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
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
      title: "Questionnaire Submitted",
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
              {step === 2 && "Health"}
              {step === 3 && "Diet"}
              {step === 4 && "Goals"}
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
              <div className="grid grid-cols-2 gap-4">
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
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => handleChange("gender", value)}
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
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height</Label>
                  <div className="flex gap-2">
                    <Input
                      id="height"
                      value={formData.height}
                      onChange={(e) => handleChange("height", e.target.value)}
                      placeholder="cm"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <div className="flex gap-2">
                    <Input
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => handleChange("weight", e.target.value)}
                      placeholder="kg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select 
                  value={formData.activityLevel}
                  onValueChange={(value) => handleChange("activityLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very_active">Very active (very hard exercise & physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>
                Please tell us about any health conditions or concerns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Medical Conditions</Label>
                <div className="space-y-2">
                  {["Diabetes", "Hypertension", "Heart Disease", "IBS", "Celiac Disease", "None"].map((condition) => (
                    <div className="flex items-center space-x-2" key={condition}>
                      <Checkbox
                        id={condition}
                        checked={formData.medicalConditions.includes(condition)}
                        onCheckedChange={() => handleCheckboxChange(condition, "medicalConditions")}
                      />
                      <Label htmlFor={condition}>{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Allergies or Food Intolerances</Label>
                <div className="space-y-2">
                  {["Dairy", "Gluten", "Nuts", "Seafood", "Eggs", "None"].map((allergy) => (
                    <div className="flex items-center space-x-2" key={allergy}>
                      <Checkbox
                        id={allergy}
                        checked={formData.allergies.includes(allergy)}
                        onCheckedChange={() => handleCheckboxChange(allergy, "allergies")}
                      />
                      <Label htmlFor={allergy}>{allergy}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => handleChange("medications", e.target.value)}
                  placeholder="List any medications you're currently taking"
                />
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle>Dietary Information</CardTitle>
              <CardDescription>
                Tell us about your current diet and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dietType">Current Diet Type</Label>
                <Select 
                  value={formData.dietType}
                  onValueChange={(value) => handleChange("dietType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omnivore">Omnivore (Everything)</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mealFrequency">How many meals do you eat per day?</Label>
                <Select 
                  value={formData.mealFrequency}
                  onValueChange={(value) => handleChange("mealFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 meals</SelectItem>
                    <SelectItem value="3">3 meals</SelectItem>
                    <SelectItem value="4-5">4-5 meals</SelectItem>
                    <SelectItem value="6+">6+ meals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="waterIntake">Daily Water Intake</Label>
                <Select 
                  value={formData.waterIntake}
                  onValueChange={(value) => handleChange("waterIntake", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select water intake" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less_than_1L">Less than 1L</SelectItem>
                    <SelectItem value="1L_to_2L">1-2 liters</SelectItem>
                    <SelectItem value="2L_to_3L">2-3 liters</SelectItem>
                    <SelectItem value="more_than_3L">More than 3 liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="foodPreferences">Food Preferences</Label>
                <Textarea
                  id="foodPreferences"
                  value={formData.foodPreferences}
                  onChange={(e) => handleChange("foodPreferences", e.target.value)}
                  placeholder="List foods you particularly enjoy"
                />
              </div>

              <div>
                <Label htmlFor="foodDislikes">Food Dislikes</Label>
                <Textarea
                  id="foodDislikes"
                  value={formData.foodDislikes}
                  onChange={(e) => handleChange("foodDislikes", e.target.value)}
                  placeholder="List foods you dislike or avoid"
                />
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 4 && (
          <>
            <CardHeader>
              <CardTitle>Your Goals</CardTitle>
              <CardDescription>
                Help us understand what you want to achieve
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="healthGoal">Primary Health Goal</Label>
                <Select 
                  value={formData.healthGoal}
                  onValueChange={(value) => handleChange("healthGoal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your main goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="weight_gain">Weight Gain</SelectItem>
                    <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                    <SelectItem value="muscle_building">Muscle Building</SelectItem>
                    <SelectItem value="improve_health">Improve Overall Health</SelectItem>
                    <SelectItem value="manage_condition">Manage Health Condition</SelectItem>
                    <SelectItem value="increase_energy">Increase Energy Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.healthGoal === "weight_loss" || formData.healthGoal === "weight_gain") && (
                <div>
                  <Label htmlFor="targetWeight">Target Weight</Label>
                  <Input
                    id="targetWeight"
                    type="text"
                    value={formData.targetWeight}
                    onChange={(e) => handleChange("targetWeight", e.target.value)}
                    placeholder="kg"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="timeframe">Expected Timeframe</Label>
                <Select 
                  value={formData.timeframe}
                  onValueChange={(value) => handleChange("timeframe", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1_month">1 month</SelectItem>
                    <SelectItem value="3_months">3 months</SelectItem>
                    <SelectItem value="6_months">6 months</SelectItem>
                    <SelectItem value="1_year">1 year</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleChange("additionalInfo", e.target.value)}
                  placeholder="Anything else you'd like your dietitian to know?"
                  rows={4}
                />
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
