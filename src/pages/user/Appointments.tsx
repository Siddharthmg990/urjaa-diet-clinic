
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

// Mock data for appointments
const upcomingAppointments = [
  {
    id: 1,
    date: new Date("2023-10-20T14:00:00"),
    dietitianName: "Dr. Sarah Johnson",
    type: "video",
    duration: 45,
    status: "confirmed",
    notes: "Follow-up on Mediterranean diet progress"
  },
  {
    id: 2,
    date: new Date("2023-11-05T10:30:00"),
    dietitianName: "Dr. Sarah Johnson",
    type: "in-person",
    duration: 60,
    status: "pending",
    notes: "Monthly check-in and measurements"
  }
];

const pastAppointments = [
  {
    id: 3,
    date: new Date("2023-09-15T11:00:00"),
    dietitianName: "Dr. Sarah Johnson",
    type: "video",
    duration: 45,
    status: "completed",
    notes: "Initial consultation and health assessment"
  },
  {
    id: 4,
    date: new Date("2023-08-30T15:30:00"),
    dietitianName: "Dr. Michael Chen",
    type: "phone",
    duration: 30,
    status: "completed",
    notes: "Quick follow-up on food diary"
  }
];

// Available time slots for booking
const availableTimeSlots = {
  morning: ["9:00 AM", "10:00 AM", "11:00 AM"],
  afternoon: ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
  evening: ["5:00 PM", "6:00 PM"]
};

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingType, setBookingType] = useState("video");
  const [selectedTime, setSelectedTime] = useState("");
  const { toast } = useToast();

  const handleBookAppointment = () => {
    if (!date || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select both a date and time",
      });
      return;
    }

    toast({
      title: "Appointment Requested",
      description: `Your appointment has been requested for ${format(date, "MMMM d, yyyy")} at ${selectedTime}`,
    });
    setShowBookingDialog(false);
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
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const renderAppointmentCard = (appointment: typeof upcomingAppointments[0]) => {
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
        {isUpcoming && (
          <CardFooter className="flex justify-between border-t pt-4">
            {appointment.type === "video" && (
              <Button variant="outline" className="flex-1 mr-2">
                <VideoIcon className="h-4 w-4 mr-2" /> Join Video
              </Button>
            )}
            <Button variant="destructive" className="flex-1" size="sm">
              Cancel
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

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
                <div className="grid grid-cols-3 gap-2">
                  {availableTimeSlots.morning.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-nourish-primary" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                  {availableTimeSlots.afternoon.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-nourish-primary" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                  {availableTimeSlots.evening.map((time) => (
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
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Appointment Type</h3>
                <Select value={bookingType} onValueChange={setBookingType}>
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
