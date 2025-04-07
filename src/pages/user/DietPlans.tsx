
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, CheckCircle, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Types for tracking plan activity
interface PlanActivity {
  type: "start" | "pause";
  timestamp: number;
}

// Enhanced diet plan type with activity tracking
interface DietPlan {
  id: string;
  title: string;
  type: "active" | "past";
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  weeks: Array<{
    week: number;
    title: string;
    complete: boolean;
    description: string;
    downloadUrl: string;
    active?: boolean;
  }>;
  activities?: PlanActivity[];
  isRunning?: boolean;
}

// Mock data for diet plans
const initialDietPlans: DietPlan[] = [
  {
    id: "plan1",
    title: "Mediterranean Diet Plan",
    type: "active",
    description: "A heart-healthy eating plan that emphasizes fruits, vegetables, whole grains, beans, nuts, and seeds.",
    startDate: "2023-09-01",
    endDate: "2023-10-15",
    progress: 65,
    isRunning: true,
    activities: [
      { type: "start", timestamp: new Date("2023-09-01").getTime() }
    ],
    weeks: [
      {
        week: 1,
        title: "Introduction Week",
        complete: true,
        description: "Getting started with Mediterranean principles",
        downloadUrl: "#"
      },
      {
        week: 2,
        title: "Building Healthy Habits",
        complete: false,
        description: "Focusing on incorporating more vegetables and olive oil",
        downloadUrl: "#",
        active: true
      },
      {
        week: 3,
        title: "Advanced Mediterranean",
        complete: false,
        description: "Introducing more fish and reducing red meat",
        downloadUrl: "#"
      },
      {
        week: 4,
        title: "Maintenance & Sustainability",
        complete: false,
        description: "Creating sustainable eating habits for long-term health",
        downloadUrl: "#"
      }
    ]
  },
  {
    id: "plan2",
    title: "Low-FODMAP Diet",
    type: "past",
    description: "A specialized eating plan to help manage symptoms of IBS by limiting certain carbohydrates.",
    startDate: "2023-06-15",
    endDate: "2023-08-15",
    progress: 100,
    isRunning: false,
    activities: [
      { type: "start", timestamp: new Date("2023-06-15").getTime() },
      { type: "pause", timestamp: new Date("2023-06-20").getTime() },
      { type: "start", timestamp: new Date("2023-06-25").getTime() },
      { type: "pause", timestamp: new Date("2023-08-15").getTime() }
    ],
    weeks: [
      {
        week: 1,
        title: "Elimination Phase",
        complete: true,
        description: "Removing high-FODMAP foods from your diet",
        downloadUrl: "#"
      },
      {
        week: 2,
        title: "Continued Elimination",
        complete: true,
        description: "Maintaining strict elimination and monitoring symptoms",
        downloadUrl: "#"
      },
      {
        week: 3,
        title: "Reintroduction Phase 1",
        complete: true,
        description: "Carefully reintroducing select food groups",
        downloadUrl: "#"
      },
      {
        week: 4,
        title: "Reintroduction Phase 2",
        complete: true,
        description: "Continuing to test tolerance to different foods",
        downloadUrl: "#"
      }
    ]
  }
];

const DietPlans = () => {
  const [selectedTab, setSelectedTab] = useState("active");
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(initialDietPlans);
  const { toast } = useToast();

  const activePlans = dietPlans.filter(plan => plan.type === "active");
  const pastPlans = dietPlans.filter(plan => plan.type === "past");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handlePlanToggle = (planId: string) => {
    setDietPlans(prevPlans => 
      prevPlans.map(plan => {
        if (plan.id === planId) {
          const isCurrentlyRunning = plan.isRunning;
          // Ensure type safety by explicitly defining the activity type
          const newActivity: PlanActivity = {
            type: isCurrentlyRunning ? "pause" : "start",
            timestamp: Date.now()
          };
          
          // Create a new array of activities with the proper type
          const newActivities: PlanActivity[] = [
            ...(plan.activities || []), 
            newActivity
          ];

          toast({
            title: isCurrentlyRunning ? "Plan Paused" : "Plan Started",
            description: `Your ${plan.title} has been ${isCurrentlyRunning ? "paused" : "started"}.`,
          });

          return {
            ...plan,
            isRunning: !isCurrentlyRunning,
            activities: newActivities
          };
        }
        return plan;
      })
    );
  };

  const getTotalActiveDays = (activities: PlanActivity[] = []) => {
    let totalActiveDays = 0;
    let lastStartTime: number | null = null;

    for (const activity of activities) {
      if (activity.type === "start") {
        lastStartTime = activity.timestamp;
      } else if (activity.type === "pause" && lastStartTime) {
        const activeTimeMs = activity.timestamp - lastStartTime;
        const activeDays = Math.floor(activeTimeMs / (1000 * 60 * 60 * 24));
        totalActiveDays += activeDays;
        lastStartTime = null;
      }
    }

    // If the plan is currently running, calculate days until now
    if (lastStartTime) {
      const activeTimeMs = Date.now() - lastStartTime;
      const activeDays = Math.floor(activeTimeMs / (1000 * 60 * 60 * 24));
      totalActiveDays += activeDays;
    }

    return totalActiveDays;
  };

  const calculateProgress = (plan: DietPlan) => {
    // Calculate progress based on active days (assuming 30-day plan)
    const activeDays = getTotalActiveDays(plan.activities);
    return Math.min(Math.floor((activeDays / 30) * 100), 100);
  };

  const renderPlanDetails = (plan: DietPlan) => {
    const currentProgress = plan.type === "active" ? calculateProgress(plan) : plan.progress;
    
    return (
      <Card key={plan.id} className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>
                {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
              </CardDescription>
            </div>
            {plan.type === "active" && (
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <Badge className="bg-nourish-primary mr-2">
                    {currentProgress}% Complete
                  </Badge>
                  <Button
                    size="sm"
                    variant={plan.isRunning ? "destructive" : "default"}
                    className="flex items-center gap-1"
                    onClick={() => handlePlanToggle(plan.id)}
                  >
                    {plan.isRunning ? 
                      <><Pause className="h-4 w-4" /> Pause Plan</> : 
                      <><Play className="h-4 w-4" /> Start Plan</>
                    }
                  </Button>
                </div>
                <Progress value={currentProgress} className="h-2 w-24" />
              </div>
            )}
            {plan.type === "past" && (
              <Badge className="bg-gray-500">Completed</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-600">{plan.description}</p>
          
          <div className="space-y-4">
            {plan.weeks.map((week) => (
              <div key={week.week} className={`p-4 rounded-md ${
                week.active 
                  ? "border-2 border-nourish-primary bg-nourish-light" 
                  : "border border-gray-200"
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {week.complete && (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    )}
                    <h3 className="font-medium">
                      Week {week.week}: {week.title}
                      {week.active && (
                        <span className="ml-2 text-xs bg-nourish-primary text-white px-2 py-1 rounded">
                          Current
                        </span>
                      )}
                    </h3>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">{week.description}</p>
              </div>
            ))}
          </div>
          
          {plan.type === "active" && (
            <div className="border-t mt-6 pt-4">
              <h3 className="font-medium mb-3">Today's Meal Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm font-medium text-gray-500 mb-1">Breakfast</div>
                  <p>Greek yogurt with honey, berries and nuts</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm font-medium text-gray-500 mb-1">Lunch</div>
                  <p>Mediterranean salad with chickpeas and olive oil dressing</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm font-medium text-gray-500 mb-1">Dinner</div>
                  <p>Grilled fish with roasted vegetables</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-nourish-dark mb-2">Diet Plans</h1>
        <p className="text-gray-600">
          View and manage your personalized nutrition plans
        </p>
      </div>

      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="past">Past Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {activePlans.length > 0 ? (
            activePlans.map(plan => renderPlanDetails(plan))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-md">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Active Plans</h3>
              <p className="text-gray-500 mb-4">
                You don't have any active diet plans at the moment.
              </p>
              <Button>Schedule Consultation</Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="past">
          {pastPlans.length > 0 ? (
            pastPlans.map(plan => renderPlanDetails(plan))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-md">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Past Plans</h3>
              <p className="text-gray-500">
                You haven't completed any diet plans yet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DietPlans;
