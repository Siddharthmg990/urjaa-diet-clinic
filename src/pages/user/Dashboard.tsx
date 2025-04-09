import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Clipboard, Utensils, Phone, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// import { SampleDataGenerator } from '@/components/SampleDataGenerator';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for the dashboard
  const upcomingAppointment = {
    date: "October 20, 2023",
    time: "2:00 PM",
    dietitian: "Dr. Sarah Johnson",
  };

  const mealPlanProgress = 65; // Percentage complete

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-nourish-dark">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center border-2 border-nourish-light hover:border-nourish-primary hover:bg-nourish-light"
          onClick={() => navigate("/user/questionnaire")}
        >
          <Clipboard className="h-6 w-6 mb-1 text-nourish-primary" />
          <span>Health Assessment</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center border-2 border-nourish-light hover:border-nourish-primary hover:bg-nourish-light"
          onClick={() => navigate("/user/diet-plans")}
        >
          <Utensils className="h-6 w-6 mb-1 text-nourish-primary" />
          <span>View Diet Plans</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center border-2 border-nourish-light hover:border-nourish-primary hover:bg-nourish-light"
          onClick={() => navigate("/user/appointments")}
        >
          <Calendar className="h-6 w-6 mb-1 text-nourish-primary" />
          <span>Schedule Appointment</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center border-2 border-nourish-light hover:border-nourish-primary hover:bg-nourish-light"
          onClick={() => navigate("/user/contact")}
        >
          <Phone className="h-6 w-6 mb-1 text-nourish-primary" />
          <span>Contact Clinic</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Appointment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-nourish-primary" />
              Upcoming Appointment
            </CardTitle>
            <CardDescription>Your next session with your dietitian</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointment ? (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Date & Time</span>
                    <span className="text-nourish-primary">
                      {upcomingAppointment.date} • {upcomingAppointment.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Dietitian</span>
                    <span>{upcomingAppointment.dietitian}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/user/appointments")}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="destructive"
                    className="bg-red-100 text-red-600 hover:bg-red-200 border-0"
                  >
                    Reschedule
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No upcoming appointments</p>
                <Button onClick={() => navigate("/user/appointments")}>
                  Schedule Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Diet Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="mr-2 h-5 w-5 text-nourish-primary" />
              Current Diet Plan
            </CardTitle>
            <CardDescription>Your progress on the current plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Plan Name</span>
                  <span className="text-nourish-primary">Mediterranean Diet - Week 2</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Progress</span>
                  <span>{mealPlanProgress}%</span>
                </div>
                <Progress value={mealPlanProgress} className="h-2 bg-gray-200" />
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Today's Highlights</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Drink 8 glasses of water</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Include 2 portions of vegetables with lunch</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>30 minutes of brisk walking</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                onClick={() => navigate("/user/diet-plans")}
                className="w-full mt-4"
              >
                View Full Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Nutrition Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Tip of the Day</CardTitle>
          <CardDescription>Helpful advice from our nutrition experts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-nourish-light p-4 rounded-md border border-nourish-light">
            <h3 className="font-medium text-lg text-nourish-primary mb-2">
              The Power of Plant Proteins
            </h3>
            <p className="text-gray-700">
              Plant proteins like lentils, chickpeas, and tofu are not only excellent sources of protein but also provide fiber and various micronutrients. Try incorporating a variety of plant proteins into your meals for better health and environmental sustainability.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
