
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/types/supabase";
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
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            dietitian:profiles!dietitian_id(name)
          `)
          .eq('user_id', userId)
          .order('appointment_date', { ascending: true });

        if (error) {
          console.error('Error fetching appointments:', error);
          throw error;
        }

        return data.map((appointment) => ({
          id: appointment.id,
          date: new Date(`${appointment.appointment_date}T${convertTo24HourFormat(appointment.appointment_time || '12:00 PM')}:00`),
          dietitianName: appointment.dietitian?.name || "Dr. Sarah Johnson",
          type: determineAppointmentType(appointment.notes),
          duration: 30,
          status: appointment.status || "pending",
          notes: appointment.reason || ""
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
      
      // Fix: Assign a default dietitian ID that exists in your database
      // For now, we'll use null since we don't know which dietitian IDs exist
      const appointmentData = {
        appointment_date: format(date, "yyyy-MM-dd"),
        appointment_time: time,
        status: 'requested',
        reason: `${type} consultation request`,
        notes: `${type} session requested by client`,
        user_id: userId,
        dietitian_id: null // Changed from hardcoded UUID to null
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select();

      if (error) {
        console.error("Appointment creation error:", error);
        throw error;
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
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .select();

      if (error) throw error;
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

  // Helper function to determine appointment type
  const determineAppointmentType = (notes: string | null): "video" | "in-person" | "phone" => {
    if (!notes) return "in-person";
    if (notes.toLowerCase().includes('video')) return "video";
    if (notes.toLowerCase().includes('phone')) return "phone";
    return "in-person";
  };

  // Helper function to convert time formats
  const convertTo24HourFormat = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    
    return `${hours}:${minutes}`;
  };

  return {
    appointments,
    isLoading,
    createAppointment,
    cancelAppointment,
    isBookingModalOpen,
    setIsBookingModalOpen
  };
};
