
import apiClient from "@/api/client";

// This function runs once when the application loads
export const setupAppOnLoad = async () => {
  try {
    // Initialize storage bucket immediately, regardless of auth state
    const { data } = await apiClient.post('/storage/initialize');
    
    // Return success status from API
    return data.success || false;
  } catch (error) {
    console.error("Error setting up application:", error);
    return false;
  }
};
