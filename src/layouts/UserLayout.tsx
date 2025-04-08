
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  Home, 
  User, 
  ClipboardList, 
  Utensils, 
  Calendar, 
  Phone, 
  CreditCard,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/user/dashboard", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { to: "/user/profile", icon: <User className="w-5 h-5" />, label: "Profile" },
    { to: "/user/questionnaire", icon: <ClipboardList className="w-5 h-5" />, label: "Health Assessment" },
    { to: "/user/diet-plans", icon: <Utensils className="w-5 h-5" />, label: "Diet Plans" },
    { to: "/user/appointments", icon: <Calendar className="w-5 h-5" />, label: "Appointments" },
    { to: "/user/contact", icon: <Phone className="w-5 h-5" />, label: "Contact Us" },
    { to: "/user/payment", icon: <CreditCard className="w-5 h-5" />, label: "Subscriptions" },
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed sidebar header for mobile */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b p-4 flex items-center justify-between md:hidden">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md bg-nourish-primary text-white mr-3"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div>
            <h1 className="text-lg font-bold text-nourish-primary">Urjaa Diet Clinic</h1>
            <p className="text-sm text-nourish-dark">Welcome, {user?.name}</p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "w-64 bg-nourish-light border-r border-nourish-light fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-nourish-light">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/f7765fc9-936c-46a5-ae43-a10b6865058a.png" 
                alt="Urjaa Diet Clinic Logo" 
                className="h-10 mr-2"
              />
              <div>
                <h1 className="text-lg font-bold text-nourish-primary">Urjaa Diet Clinic</h1>
                <p className="text-sm text-nourish-dark">Welcome, {user?.name}</p>
              </div>
            </div>
          </div>

          <nav className="flex-grow overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-3 py-2 rounded-md hover:bg-nourish-primary hover:text-white transition-colors duration-200",
                        isActive
                          ? "bg-nourish-primary text-white"
                          : "text-nourish-dark"
                      )
                    }
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-nourish-light">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-grow transition-all duration-300 ease-in-out",
        "md:ml-64", // Always offset on desktop
        "pt-16 md:pt-0" // Padding top for mobile header
      )}>
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}
        
        <div className="container mx-auto py-6 px-4 max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
