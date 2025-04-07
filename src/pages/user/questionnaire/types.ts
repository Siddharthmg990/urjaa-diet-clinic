
export interface QuestionnaireFormData {
  // Personal Information
  fullName: string;
  age: string;
  height: string;
  heightUnit: "feet" | "cm";
  weight: string;
  weightUnit: "kg" | "lbs";
  sex: string;
  city: string; // Added city field
  workingHours: { start: string; end: string };
  
  // Medical Information
  healthConcerns: string;
  medicalConditions: string[];
  otherCondition: string;
  
  // Lifestyle & Eating Habits Information
  dietType: string;
  wakeupTime: string;
  sleepTime: string;
  meals: { time: string; description: string }[];
  
  // Daily Routine Information
  profession: string;
  occupation: string; // New field for detailed occupation
  leaveHomeTime: string;
  returnHomeTime: string;
  breakTimes: string;
  
  // Physical Activity
  activities: {
    type: string;
    time: string;
    duration: string;
  }[];
  
  // Photos & Reports
  photos: File[];
  medicalReports: File[];
}
