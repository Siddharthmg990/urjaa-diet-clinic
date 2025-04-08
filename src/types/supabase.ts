
// Define profile type
export interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  phone_verified: boolean | null;
  role: "user" | "dietitian" | null;
  created_at: string | null;
  updated_at: string | null;
}

// Define appointment type
export interface Appointment {
  id: string;
  user_id: string | null;
  dietitian_id: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
  status: "confirmed" | "pending" | "requested" | "completed" | "cancelled" | null;
  reason: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  dietitian?: {
    name: string | null;
  } | null;
}

// Define diet plan type
export interface DietPlan {
  id: string;
  user_id: string | null;
  dietitian_id: string | null;
  title: string;
  description: string | null;
  content: any;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Define diet plan log type
export interface DietPlanLog {
  id: string;
  diet_plan_id: string | null;
  user_id: string | null;
  action: string;
  timestamp: string | null;
}

// Define health assessment type
export interface HealthAssessment {
  id: string;
  user_id: string | null;
  full_name: string | null;
  age: string | null;
  height: string | null;
  height_unit: string | null;
  weight: string | null;
  weight_unit: string | null;
  sex: string | null;
  city: string | null;
  health_concerns: string | null;
  medical_conditions: string[] | null;
  other_condition: string | null;
  diet_type: string | null;
  wakeup_time: string | null;
  sleep_time: string | null;
  profession: string | null;
  occupation: string | null;
  leave_home_time: string | null;
  return_home_time: string | null;
  break_times: string | null;
  working_hours: {
    start: string;
    end: string;
  } | null;
  meals: {
    time: string;
    description: string;
  }[] | null;
  activities: {
    type: string;
    time: string;
    duration: string;
  }[] | null;
  photo_urls: string[] | null;
  medical_report_urls: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

// Define contact message type
export interface ContactMessage {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  message: string;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}
