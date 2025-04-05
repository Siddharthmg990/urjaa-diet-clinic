
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "dietitian") {
        navigate("/dietitian/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-nourish-primary">Nourish</h1>
          </div>
          <div className="flex space-x-2">
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="border-nourish-primary text-nourish-primary hover:bg-nourish-light"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-nourish-primary hover:bg-nourish-dark text-white"
                >
                  Sign up
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate(user?.role === "dietitian" ? "/dietitian/dashboard" : "/user/dashboard")}
                className="bg-nourish-primary hover:bg-nourish-dark text-white"
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-nourish-light to-white py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-nourish-dark mb-6">
              Your Personal Journey to Better Health
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Connect with expert dietitians, get personalized meal plans, and track your progress
              all in one place. Start your journey to a healthier you today.
            </p>
            <Button
              onClick={handleGetStarted}
              className="bg-nourish-primary hover:bg-nourish-dark text-white px-8 py-6 text-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-nourish-dark mb-12">
            Comprehensive Health & Nutrition Support
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="nourish-card p-6 text-center">
              <div className="w-16 h-16 bg-nourish-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-nourish-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-nourish-dark">Personalized Diet Plans</h3>
              <p className="text-gray-600">
                Receive customized meal plans based on your health assessment, goals, and dietary preferences.
              </p>
            </div>

            <div className="nourish-card p-6 text-center">
              <div className="w-16 h-16 bg-nourish-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-nourish-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-nourish-dark">Schedule Appointments</h3>
              <p className="text-gray-600">
                Book and manage appointments with your dedicated dietitian for ongoing support and adjustments.
              </p>
            </div>

            <div className="nourish-card p-6 text-center">
              <div className="w-16 h-16 bg-nourish-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-nourish-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-nourish-dark">Progress Tracking</h3>
              <p className="text-gray-600">
                Track your wellness journey with detailed progress metrics and achievement milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nourish-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Nourish</h2>
              <p className="text-sm opacity-75">Your partner in healthy living</p>
            </div>
            <div className="text-sm opacity-75">
              &copy; {new Date().getFullYear()} Nourish Connect Wellbeing. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
