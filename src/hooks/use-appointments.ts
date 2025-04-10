
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

interface UseAppointmentsProps {
  userId?: string;
  isAuthenticated: boolean;
}

interface AppointmentCreateData {
  userId: string;
  date: Date | string;
  time: string;
  type: 'video' | 'in-person' | 'phone';
}

export const useAppointments = ({ userId, isAuthenticated }: UseAppointmentsProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appointments
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments', userId],
    queryFn: async () => {
      if (!userId || !isAuthenticated) {
        return [];
      }

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading appointments:', error);
        throw error;
      }

      // Process the data to format dates
      return data.map(appointment => ({
        id: appointment.id,
        date: parseISO(`${appointment.appointment_date}T${appointment.appointment_time}`),
        time: appointment.appointment_time,
        type: appointment.type || 'video', // Default to video if type is missing
        status: appointment.status,
        notes: appointment.notes,
        reason: appointment.reason,
        dietitianName: appointment.dietitian_name || 'Your Dietitian',
        duration: appointment.duration || 30,
      }));
    },
    enabled: !!userId && isAuthenticated,
  });

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async (data: AppointmentCreateData) => {
      console.log("Creating appointment with data:", data);
      
      let formattedDate;
      if (typeof data.date === 'string') {
        formattedDate = data.date; // Already formatted as YYYY-MM-DD
      } else {
        formattedDate = format(data.date, 'yyyy-MM-dd');
      }
      
      const { data: newAppointment, error } = await supabase
        .from('appointments')
        .insert([{
          user_id: data.userId,
          appointment_date: formattedDate,
          appointment_time: data.time,
          type: data.type,
          status: 'requested',
          reason: 'Nutrition consultation',
          notes: `${data.type} session requested`,
          duration: 30
        }])
        .select();

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }
      
      console.log("New appointment created:", newAppointment);
      return newAppointment[0];
    },
    onSuccess: () => {
      toast({
        title: 'Appointment Requested',
        description: 'Your appointment request has been submitted.',
      });
      setIsBookingModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: any) => {
      console.error('Appointment creation error:', error);
      toast({
        variant: 'destructive',
        title: 'Appointment Request Failed',
        description: error.message || 'Failed to request appointment. Please try again.',
      });
    },
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
      toast({
        title: 'Appointment Cancelled',
        description: 'Your appointment has been cancelled.',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Cancellation Failed',
        description: error.message || 'Failed to cancel appointment. Please try again.',
      });
    },
  });

  return {
    appointments,
    isLoading,
    error,
    createAppointment,
    cancelAppointment,
    isBookingModalOpen,
    setIsBookingModalOpen,
  };
};
