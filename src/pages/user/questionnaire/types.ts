
export interface QuestionnaireFormData {
  // Personal Information
  fullName: string;
  age: string;
  height: string;
  heightUnit: "feet" | "cm";
  weight: string;
  weightUnit: "kg" | "lbs";
  sex: string;
  workingHours: { start: string; end: string };
  
  // Medical Information
  healthConcerns: string;
  medicalConditions: string[];
  otherCondition: string;
  
  // Lifestyle Information
  foodHabit: string;
  wakeupTime: string;
  sleepTime: string;
  meals: { time: string; description: string }[];
  
  // Physical Activity
  activityType: string;
  activityTime: string;
  activityDuration: string;
  
  // Work & Study
  profession: string;
  leaveHomeTime: string;
  returnHomeTime: string;
  breakTimes: string;
  
  // Photos
  photos: File[];
}
