
import { useState } from "react";
import { QuestionnaireFormData } from "./types";

export const useQuestionnaireForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<QuestionnaireFormData>({
    fullName: "",
    age: "",
    height: "",
    heightUnit: "feet",
    weight: "",
    weightUnit: "kg",
    sex: "",
    city: "",
    workingHours: { start: "", end: "" },
    healthConcerns: "",
    medicalConditions: [] as string[],
    otherCondition: "",
    dietType: "",
    wakeupTime: "",
    sleepTime: "",
    meals: [{ time: "", description: "" }],
    profession: "",
    occupation: "",
    leaveHomeTime: "",
    returnHomeTime: "",
    breakTimes: "",
    activities: [{ 
      type: "",
      time: "",
      duration: ""
    }],
    photos: [] as File[],
    medicalReports: [] as File[],
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field] && value) {
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors[field];
        return updatedErrors;
      });
    }
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

  const handleActivityChange = (index: number, field: 'type' | 'time' | 'duration', value: string) => {
    setFormData(prev => {
      const updatedActivities = [...prev.activities];
      updatedActivities[index] = { ...updatedActivities[index], [field]: value };
      return { ...prev, activities: updatedActivities };
    });
  };

  const addMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, { time: "", description: "" }]
    }));
  };

  const addActivity = () => {
    if (formData.activities.length < 2) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, { type: "", time: "", duration: "" }]
      }));
    }
  };

  const removeMeal = (index: number) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals.splice(index, 1);
      return { ...prev, meals: updatedMeals.length ? updatedMeals : [{ time: "", description: "" }] };
    });
  };

  const removeActivity = (index: number) => {
    setFormData(prev => {
      const updatedActivities = [...prev.activities];
      updatedActivities.splice(index, 1);
      return { ...prev, activities: updatedActivities.length ? updatedActivities : [{ type: "", time: "", duration: "" }] };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: "photos" | "medicalReports") => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setFormData(prev => ({
        ...prev,
        [fileType]: [...prev[fileType], ...filesArray]
      }));

      if (errors[fileType] && filesArray.length > 0) {
        setErrors(prev => {
          const updatedErrors = { ...prev };
          delete updatedErrors[fileType];
          return updatedErrors;
        });
      }
    }
  };

  const removeFile = (index: number, fileType: "photos" | "medicalReports") => {
    setFormData(prev => {
      const updatedFiles = [...prev[fileType]];
      updatedFiles.splice(index, 1);
      return { ...prev, [fileType]: updatedFiles };
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.city) {
        newErrors.city = "City is required";
      }
      if (!formData.age) {
        newErrors.age = "Age is required";
      }
      if (!formData.height.trim()) {
        newErrors.height = "Height is required";
      }
      if (!formData.weight.trim()) {
        newErrors.weight = "Weight is required";
      }
      if (!formData.sex) {
        newErrors.sex = "Sex is required";
      }
    } else if (step === 2) {
      if (!formData.healthConcerns.trim()) {
        newErrors.healthConcerns = "Health concerns are required";
      }
    } else if (step === 3) {
      if (!formData.profession) {
        newErrors.profession = "Profession is required";
      }
      
      if (formData.profession && formData.profession !== "homemaker" && !formData.occupation) {
        newErrors.occupation = "Occupation is required";
      }
      
      if (formData.profession === "working" || formData.profession === "other" || formData.profession === "student") {
        if (!formData.leaveHomeTime) {
          newErrors.leaveHomeTime = "Leave home time is required";
        }
        if (!formData.returnHomeTime) {
          newErrors.returnHomeTime = "Return home time is required";
        }
      }
      
      if (formData.profession === "student" && !formData.breakTimes) {
        newErrors.breakTimes = "Break times are required";
      }
    } else if (step === 4) {
      if (!formData.dietType.trim()) {
        newErrors.dietType = "Diet type is required";
      }
      if (!formData.wakeupTime.trim()) {
        newErrors.wakeupTime = "Wake up time is required";
      }
      if (!formData.sleepTime.trim()) {
        newErrors.sleepTime = "Sleep time is required";
      }
      if (!formData.meals[0].time || !formData.meals[0].description) {
        newErrors.meals = "At least one meal is required";
      }
      
      if (formData.activities.length > 0 && formData.activities[0].type !== "None") {
        formData.activities.forEach((activity, index) => {
          if (!activity.type) {
            newErrors[`activities.${index}.type`] = "Activity type is required";
          }
          if (!activity.time) {
            newErrors[`activities.${index}.time`] = "Activity time is required";
          }
          if (!activity.duration) {
            newErrors[`activities.${index}.duration`] = "Activity duration is required";
          }
        });
      }
    } else if (step === 5) {
      if (formData.photos.length === 0) {
        newErrors.photos = "At least one photo is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    handleChange,
    handleCheckboxChange,
    handleMealChange,
    handleActivityChange,
    addMeal,
    addActivity,
    removeMeal,
    removeActivity,
    handleFileChange,
    removeFile,
    validateStep,
    setErrors,
  };
};
