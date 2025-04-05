
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CalendarClock, 
  ClipboardCheck, 
  FileText,
  UserCheck,
  UserX,
  ArrowUpRight,
  BarChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Mock data for the dashboard
const stats = {
  totalPatients: 24,
  appointmentsToday: 3,
  pendingQuestionnaires: 2,
  plansToUpdate: 4
};

const recentPatients = [
  { id: "1", name: "Emma Johnson", lastVisit: "2023-10-10", status: "active", progress: 75 },
  { id: "2", name: "Daniel Smith", lastVisit: "2023-10-08", status: "missed", progress: 45 },
  { id: "3", name: "Sarah Williams", lastVisit: "2023-10-05", status: "active", progress: 90 }
];

const todayAppointments = [
  { id: "1", patientName: "Emma Johnson", time: "11:00 AM", type: "followup" },
  { id: "2", patientName: "Michael Brown", time: "2:30 PM", type: "initial" },
  { id: "3", patientName: "Jessica Davis", time: "4:00 PM", type: "followup" }
];

const DietitianDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-nourish-dark mb-2">Dietitian Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <Button onClick={() => navigate("/dietitian/appointments")} className="bg-nourish-primary hover:bg-nourish-dark">
          Manage Appointments
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <div className="h-12 w-12 rounded-full bg-nourish-light flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-nourish-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <h3 className="text-2xl font-bold">{stats.totalPatients}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <div className="h-12 w-12 rounded-full bg-nourish-light flex items-center justify-center mr-4">
              <CalendarClock className="h-6 w-6 text-nourish-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
              <h3 className="text-2xl font-bold">{stats.appointmentsToday}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <div className="h-12 w-12 rounded-full bg-nourish-light flex items-center justify-center mr-4">
              <ClipboardCheck className="h-6 w-6 text-nourish-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">New Questionnaires</p>
              <h3 className="text-2xl font-bold">{stats.pendingQuestionnaires}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <div className="h-12 w-12 rounded-full bg-nourish-light flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-nourish-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Plans to Update</p>
              <h3 className="text-2xl font-bold">{stats.plansToUpdate}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarClock className="mr-2 h-5 w-5" />
                Today's Appointments
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-gray-500">{appointment.time} · {appointment.type === "initial" ? "Initial Consultation" : "Follow-up"}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {todayAppointments.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No appointments scheduled for today</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Patients */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Recent Patients
                  </CardTitle>
                  <CardDescription>
                    Monitor your patients' progress
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/dietitian/patients")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      {patient.status === "active" ? (
                        <UserCheck className="h-10 w-10 text-green-500 mr-3 bg-green-50 p-2 rounded-full" />
                      ) : (
                        <UserX className="h-10 w-10 text-red-500 mr-3 bg-red-50 p-2 rounded-full" />
                      )}
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-500">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 text-right">
                        <p className="text-sm font-medium">Progress</p>
                        <div className="flex items-center">
                          <span className={`text-sm ${
                            patient.progress > 70 ? "text-green-600" : 
                            patient.progress > 40 ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {patient.progress}%
                          </span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full ml-2">
                            <div 
                              className={`h-full rounded-full ${
                                patient.progress > 70 ? "bg-green-500" : 
                                patient.progress > 40 ? "bg-yellow-500" : "bg-red-500"
                              }`} 
                              style={{ width: `${patient.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trends and Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="mr-2 h-5 w-5" />
            Patient Progress Overview
          </CardTitle>
          <CardDescription>
            Aggregate progress metrics across your patient base
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Charts and analytics will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietitianDashboard;
