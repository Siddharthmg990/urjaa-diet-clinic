
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Clock, Video, Phone, Plus, Users } from "lucide-react";
import { format, addMinutes } from "date-fns";

// Mock appointment data
const mockAppointments = [
  {
    id: "1",
    patientName: "Jane Cooper",
    patientEmail: "jane.cooper@example.com",
    date: "2025-04-05",
    time: "10:00",
    duration: 30,
    type: "video",
    status: "upcoming"
  },
  {
    id: "2",
    patientName: "Robert Fox",
    patientEmail: "robert.fox@example.com",
    date: "2025-04-05",
    time: "14:30",
    duration: 45,
    type: "in-person",
    status: "upcoming"
  },
  {
    id: "3",
    patientName: "Esther Howard",
    patientEmail: "esther.howard@example.com",
    date: "2025-04-06",
    time: "09:15",
    duration: 30,
    type: "phone",
    status: "upcoming"
  },
  {
    id: "4",
    patientName: "Jenny Wilson",
    patientEmail: "jenny.wilson@example.com",
    date: "2025-04-07",
    time: "11:00",
    duration: 60,
    type: "video",
    status: "upcoming"
  },
  {
    id: "5",
    patientName: "Guy Hawkins",
    patientEmail: "guy.hawkins@example.com",
    date: "2025-04-10",
    time: "16:00",
    duration: 30,
    type: "phone",
    status: "upcoming"
  }
];

const DietitianAppointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState(mockAppointments);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00",
    duration: "30",
    type: "video"
  });
  const { toast } = useToast();
  
  const handleNewAppointmentChange = (field: string, value: string) => {
    setNewAppointment({
      ...newAppointment,
      [field]: value
    });
  };
  
  const handleCreateAppointment = () => {
    // In a real app, this would send data to a backend
    const id = `appointment_${Math.random().toString(36).substring(2, 11)}`;
    const createdAppointment = {
      id,
      patientName: newAppointment.patientName,
      patientEmail: `${newAppointment.patientName.toLowerCase().replace(" ", ".")}@example.com`,
      date: newAppointment.date,
      time: newAppointment.time,
      duration: parseInt(newAppointment.duration),
      type: newAppointment.type,
      status: "upcoming"
    };
    
    setAppointments([...appointments, createdAppointment]);
    setShowNewAppointmentDialog(false);
    toast({
      title: "Appointment scheduled",
      description: `Appointment with ${newAppointment.patientName} has been scheduled successfully.`,
    });
  };
  
  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === "all") return true;
    return appointment.status === activeTab;
  });
  
  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "in-person":
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getAppointmentEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    const endDate = addMinutes(startDate, duration);
    return format(endDate, "HH:mm");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-nourish-dark mb-2">Appointments</h1>
        <p className="text-gray-600">
          Manage and schedule appointments with your patients
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
          <DialogTrigger asChild>
            <Button className="bg-nourish-primary hover:bg-nourish-dark">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Create a new appointment with a patient
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient Name</Label>
                <Input 
                  id="patient" 
                  value={newAppointment.patientName}
                  onChange={(e) => handleNewAppointmentChange("patientName", e.target.value)}
                  placeholder="Select or enter patient name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => handleNewAppointmentChange("date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input 
                    id="time" 
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => handleNewAppointmentChange("time", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select 
                    value={newAppointment.duration}
                    onValueChange={(value) => handleNewAppointmentChange("duration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select 
                    value={newAppointment.type}
                    onValueChange={(value) => handleNewAppointmentChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewAppointmentDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAppointment}
                className="bg-nourish-primary hover:bg-nourish-dark"
                disabled={!newAppointment.patientName}
              >
                Schedule Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>
                {filteredAppointments.length} appointments {activeTab === "upcoming" ? "scheduled" : activeTab}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No appointments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{appointment.patientName}</div>
                            <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {appointment.type}
                          </Badge>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 text-nourish-primary mr-2" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-nourish-primary mr-2" />
                            <span>{`${appointment.time} - ${getAppointmentEndTime(appointment.time, appointment.duration)}`}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <Badge variant="secondary" className="flex items-center">
                            {getAppointmentTypeIcon(appointment.type)}
                            <span className="ml-1">{appointment.duration} minutes</span>
                          </Badge>
                          <div>
                            <Button size="sm" variant="outline" className="mr-2">
                              Reschedule
                            </Button>
                            {appointment.type === "video" && (
                              <Button size="sm" className="bg-nourish-primary hover:bg-nourish-dark">
                                Join Call
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">
                  {date ? format(date, "MMMM d, yyyy") : "No date selected"}
                </h3>
                <div className="space-y-2">
                  {date && 
                    filteredAppointments
                      .filter(app => app.date === format(date, "yyyy-MM-dd"))
                      .map(appointment => (
                        <div 
                          key={appointment.id} 
                          className="p-2 text-sm rounded-md bg-muted flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            {getAppointmentTypeIcon(appointment.type)}
                            <span className="ml-2">
                              {appointment.time} | {appointment.patientName}
                            </span>
                          </div>
                          <Badge variant="outline">{appointment.duration}m</Badge>
                        </div>
                      ))
                  }
                  {date && 
                    filteredAppointments.filter(app => app.date === format(date, "yyyy-MM-dd")).length === 0 && (
                      <p className="text-sm text-gray-500">No appointments on this day</p>
                    )
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DietitianAppointments;
