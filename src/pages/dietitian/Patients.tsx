
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, UserPlus } from "lucide-react";

// Mock patient data
const mockPatients = [
  {
    id: "1",
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    age: 37,
    goal: "Weight loss",
    plan: "Premium",
    status: "active",
    lastAppointment: "2025-03-28",
    progress: "Good"
  },
  {
    id: "2",
    name: "Robert Fox",
    email: "robert.fox@example.com",
    age: 42,
    goal: "Muscle gain",
    plan: "Basic",
    status: "active",
    lastAppointment: "2025-04-01",
    progress: "Excellent"
  },
  {
    id: "3",
    name: "Esther Howard",
    email: "esther.howard@example.com",
    age: 29,
    goal: "Balanced diet",
    plan: "Premium",
    status: "pending",
    lastAppointment: "2025-03-15",
    progress: "Fair"
  },
  {
    id: "4",
    name: "Jenny Wilson",
    email: "jenny.wilson@example.com",
    age: 51,
    goal: "Diabetes management",
    plan: "Family",
    status: "active",
    lastAppointment: "2025-03-30",
    progress: "Good"
  },
  {
    id: "5",
    name: "Guy Hawkins",
    email: "guy.hawkins@example.com",
    age: 34,
    goal: "Sports nutrition",
    plan: "Premium",
    status: "inactive",
    lastAppointment: "2025-03-10",
    progress: "Poor"
  }
];

const DietitianPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState(mockPatients);
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.goal.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getProgressColor = (progress: string) => {
    switch (progress) {
      case "Excellent":
        return "text-green-600";
      case "Good":
        return "text-blue-600";
      case "Fair":
        return "text-yellow-600";
      case "Poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-nourish-dark mb-2">My Patients</h1>
        <p className="text-gray-600">
          Manage your patient details and track their progress
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search patients..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-nourish-primary hover:bg-nourish-dark">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
          <CardDescription>
            You have {patients.length} patients under your care
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Appointment</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.goal}</TableCell>
                    <TableCell>{patient.plan}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.lastAppointment}</TableCell>
                    <TableCell className={getProgressColor(patient.progress)}>
                      {patient.progress}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Plan</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Archive Patient
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietitianPatients;
