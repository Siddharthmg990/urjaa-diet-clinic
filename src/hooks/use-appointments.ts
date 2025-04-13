
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/api/client";
import { format } from "date-fns";

interface AppointmentDisplay {
  id: string;
  date: Date;
  dietitianName: string;
  type: "video" | "in-person" | "phone";
  duration: number;
  status: string;
  notes: string;
}

interface BookAppointmentParams {
  date: Date | undefined;
  time: string;
  type: "video" | "in-person" | "phone";
  userId: string;
}

interface UseAppointmentsProps {
  userId: string | undefined;
  isAuthenticated: boolean;
}

export const useAppointments = ({ userId, isAuthenticated }: UseAppointmentsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data } = await apiClient.get(`/appointments?user_id=${userId}`);
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        return data.appointments.map((appointment: any) => ({
          id: appointment.id,
          date: new Date(appointment.date),
          dietitianName: appointment.dietitianName,
          type: appointment.type as "video" | "in-person" | "phone",
          duration: appointment.duration,
          status: appointment.status,
          notes: appointment.notes
        }));
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        toast({
          variant: "destructive",
          title: "Could not load appointments",
          description: "Please try again later",
        });
        return [];
      }
    },
    enabled: !!isAuthenticated && !!userId,
    retry: 2,
    staleTime: 30000,
  });

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async ({ date, time, type, userId }: BookAppointmentParams) => {
      if (!date || !time) throw new Error("Date and time are required");
      
      console.log("Creating appointment:", { 
        date: format(date, "yyyy-MM-dd"), 
        time, 
        type, 
        userId 
      });
      
      const { data } = await apiClient.post('/appointments', {
        date: format(date, "yyyy-MM-dd"),
        time,
        type,
        userId
      });
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Appointment Requested",
        description: "Your appointment has been successfully requested.",
      });
      setIsBookingModalOpen(false);
    },
    onError: (error) => {
      console.error('Error booking appointment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment. Please try again.",
      });
    }
  });

  // Cancel appointment mutation
  const cancelAppointment = useMutation({
    mutationFn: async (appointmentId: string) => {
      const { data } = await apiClient.put(`/appointments/${appointmentId}`, {
        status: 'cancelled'
      });
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel appointment. Please try again.",
      });
    }
  });

  return {
    appointments,
    isLoading,
    createAppointment,
    cancelAppointment,
    isBookingModalOpen,
    setIsBookingModalOpen
  };
};
