
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/use-appointments";

// Half-hour time slots from 9am to 5pm
const availableTimeSlots = [
  "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", 
  "12:00 PM", "12:30 PM", 
  "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM"
];

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [bookingType, setBookingType] = useState<"video" | "in-person" | "phone">("video");
  const [selectedTime, setSelectedTime] = useState("");
  const { user, isAuthenticated } = useAuth();

  // Use the custom hook for appointments
  const {
    appointments,
    isLoading,
    createAppointment,
    cancelAppointment,
    isBookingModalOpen,
    setIsBookingModalOpen
  } = useAppointments({
    userId: user?.id,
    isAuthenticated: !!isAuthenticated
  });

  const handleBookAppointment = () => {
    if (!user?.id || !date || !selectedTime) {
      return;
    }
    
    createAppointment.mutate({
      date,
      time: selectedTime,
      type: bookingType,
      userId: user.id
    });
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment.mutate(id);
    }
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

  const renderAppointmentCard = (appointment: any) => {
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
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
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
                {selectedTime ? (
                  <Alert className="mb-2">
                    <AlertTitle>Selected Time</AlertTitle>
                    <AlertDescription>{selectedTime}</AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive" className="mb-2">
                    <AlertTitle>Required</AlertTitle>
                    <AlertDescription>Please select a time</AlertDescription>
                  </Alert>
                )}
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
              <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleBookAppointment} 
                className="bg-nourish-primary"
                disabled={!selectedTime || !date}
              >
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
              <Button onClick={() => setIsBookingModalOpen(true)} className="bg-nourish-primary">
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
