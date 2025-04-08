
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isAfter, isPast, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, VideoIcon, MapPin, Phone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment as AppointmentType } from "@/types/supabase";

// Define the appointment display type used in the UI
interface AppointmentDisplay {
  id: string;
  date: Date;
  dietitianName: string;
  type: "video" | "in-person" | "phone";
  duration: number;
  status: string; // Changed from union type to string to match database
  notes: string;
}

// Half-hour time slots from 11am to 3pm
const availableTimeSlots = [
  "11:00 AM", "11:30 AM", 
  "12:00 PM", "12:30 PM", 
  "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM"
];

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingType, setBookingType] = useState<"video" | "in-person" | "phone">("video");
  const [selectedTime, setSelectedTime] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appointments from Supabase
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          dietitian:dietitian_id(name)
        `)
        .eq('user_id', user.id)
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
    },
    enabled: !!isAuthenticated && !!user?.id
  });

  // Helper function to determine appointment type
  const determineAppointmentType = (notes: string | null): "video" | "in-person" | "phone" => {
    if (!notes) return "in-person";
    if (notes.includes('video')) return "video";
    if (notes.includes('phone')) return "phone";
    return "in-person";
  };

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async (newAppointment: {
      appointment_date: string;
      appointment_time: string;
      status: string;
      reason: string;
      notes: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          ...newAppointment,
          user_id: user.id
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Appointment Requested",
        description: `Your appointment has been requested for ${format(date!, "MMMM d, yyyy")} at ${selectedTime}`,
      });
      setShowBookingDialog(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book appointment. Please try again.",
      });
      console.error('Error booking appointment:', error);
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
        description: "Failed to cancel appointment. Please try again.",
      });
      console.error('Error cancelling appointment:', error);
    }
  });

  const handleBookAppointment = () => {
    if (!date || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select both a date and time",
      });
      return;
    }

    createAppointment.mutate({
      appointment_date: format(date, "yyyy-MM-dd"),
      appointment_time: selectedTime,
      status: 'requested',
      reason: "Consultation request",
      notes: `${bookingType} session requested`
    });
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment.mutate(id);
    }
  };

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

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <VideoIcon className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "requested":
        return <Badge className="bg-blue-500">Requested</Badge>;
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-400">{status}</Badge>;
    }
  };

  const upcomingAppointments = appointments.filter(
    appointment => isAfter(appointment.date, new Date()) || isToday(appointment.date)
  );

  const pastAppointments = appointments.filter(
    appointment => isPast(appointment.date) && !isToday(appointment.date)
  );

  const renderAppointmentCard = (appointment: AppointmentDisplay) => {
    const isUpcoming = isAfter(appointment.date, new Date()) || isToday(appointment.date);

    return (
      <Card key={appointment.id} className={`mb-4 ${isToday(appointment.date) ? 'border-nourish-primary' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center space-x-2">
                {isToday(appointment.date) && (
                  <Badge className="bg-nourish-primary mr-2">Today</Badge>
                )}
                <span>Appointment with {appointment.dietitianName}</span>
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {format(appointment.date, "EEEE, MMMM d, yyyy")} at {format(appointment.date, "h:mm a")}
              </CardDescription>
            </div>
            <div className="text-right">
              {getStatusBadge(appointment.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>{appointment.duration} minutes</span>
            </div>
            <div className="flex items-center">
              {getAppointmentTypeIcon(appointment.type)}
              <span className="ml-2 capitalize">{appointment.type} Session</span>
            </div>
          </div>
          {appointment.notes && (
            <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <strong>Notes:</strong> {appointment.notes}
            </div>
          )}
        </CardContent>
        {isUpcoming && appointment.status !== 'cancelled' && (
          <CardFooter className="flex justify-between border-t pt-4">
            {appointment.type === "video" && appointment.status === "confirmed" && (
              <Button variant="outline" className="flex-1 mr-2">
                <VideoIcon className="h-4 w-4 mr-2" /> Join Video
              </Button>
            )}
            <Button 
              variant="destructive" 
              className="flex-1" 
              size="sm" 
              onClick={() => handleCancelAppointment(appointment.id)}
            >
              Cancel
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-nourish-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-nourish-dark mb-2">My Appointments</h1>
          <p className="text-gray-600">
            View and manage your dietitian appointments
          </p>
        </div>
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 bg-nourish-primary hover:bg-nourish-dark">
              Book New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book an Appointment</DialogTitle>
              <DialogDescription>
                Choose a date, time, and appointment type
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-medium mb-2">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => 
                    isPast(addDays(date, 1)) || // Disable past dates
                    date.getDay() === 0 || // Disable Sundays
                    date.getDay() === 6    // Disable Saturdays
                  }
                  className="rounded-md border"
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Select Time</h3>
                <ScrollArea className="h-[180px]">
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={selectedTime === time ? "bg-nourish-primary" : ""}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Appointment Type</h3>
                <Select value={bookingType} onValueChange={(value: "video" | "in-person" | "phone") => setBookingType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBookAppointment} className="bg-nourish-primary">
                Request Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appointment => renderAppointmentCard(appointment))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-md">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Upcoming Appointments</h3>
              <p className="text-gray-500 mb-4">
                You don't have any scheduled appointments.
              </p>
              <Button onClick={() => setShowBookingDialog(true)} className="bg-nourish-primary">
                Book Now
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="past">
          {pastAppointments.length > 0 ? (
            pastAppointments.map(appointment => renderAppointmentCard(appointment))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-md">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600">No Past Appointments</h3>
              <p className="text-gray-500">
                You don't have any past appointment history.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
