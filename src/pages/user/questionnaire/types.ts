
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
  dietType: string;  // renamed from foodHabit
  wakeupTime: string;
  sleepTime: string;
  meals: { time: string; description: string }[];
  
  // Physical Activity - updated to support multiple activities
  activities: {
    type: string;
    time: string;
    duration: string; // Now will be selected from dropdown
  }[];
  
  // Work & Study - moved to lifestyle section
  profession: string;
  leaveHomeTime: string;
  returnHomeTime: string;
  breakTimes: string;
  
  // Photos & Reports - renamed from just Photos
  photos: File[];
  medicalReports: File[]; // New field for medical reports
}
