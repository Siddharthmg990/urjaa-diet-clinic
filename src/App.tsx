
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// User pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";
import Questionnaire from "./pages/user/Questionnaire";
import DietPlans from "./pages/user/DietPlans";
import Appointments from "./pages/user/Appointments";
import Contact from "./pages/user/Contact";
import Payment from "./pages/user/Payment";

// Dietitian pages
import DietitianDashboard from "./pages/dietitian/Dashboard";
import DietitianPatients from "./pages/dietitian/Patients";
import DietitianAppointments from "./pages/dietitian/Appointments";
import DietitianPlans from "./pages/dietitian/Plans";

import NotFound from "./pages/NotFound";
import UserLayout from "./layouts/UserLayout";
import DietitianLayout from "./layouts/DietitianLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Routes */}
            <Route path="/user" element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="questionnaire" element={<Questionnaire />} />
              <Route path="diet-plans" element={<DietPlans />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="contact" element={<Contact />} />
              <Route path="payment" element={<Payment />} />
            </Route>
            
            {/* Dietitian Routes */}
            <Route path="/dietitian" element={
              <ProtectedRoute requireDietitian={true}>
                <DietitianLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dietitian/dashboard" replace />} />
              <Route path="dashboard" element={<DietitianDashboard />} />
              <Route path="patients" element={<DietitianPatients />} />
              <Route path="appointments" element={<DietitianAppointments />} />
              <Route path="plans" element={<DietitianPlans />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
