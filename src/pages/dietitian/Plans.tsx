
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  FileText, 
  Search, 
  Plus, 
  MoreVertical, 
  FileEdit, 
  Copy, 
  Trash2, 
  Users 
} from "lucide-react";

// Mock diet plan templates
const mockPlans = [
  {
    id: "1",
    title: "Weight Loss Plan - Basic",
    description: "A balanced diet plan focused on gradual weight loss",
    category: "weight-loss",
    targetCalories: 1800,
    mealCount: 5,
    duration: 30, // days
    assignedTo: 2,
    createdAt: "2025-03-10"
  },
  {
    id: "2",
    title: "High Protein Muscle Building",
    description: "Protein-rich diet for muscle development and recovery",
    category: "muscle-gain",
    targetCalories: 2500,
    mealCount: 6,
    duration: 60,
    assignedTo: 1,
    createdAt: "2025-03-15"
  },
  {
    id: "3",
    title: "Diabetic Friendly Diet",
    description: "Low-carb meal plan for blood sugar management",
    category: "medical",
    targetCalories: 1600,
    mealCount: 5,
    duration: 90,
    assignedTo: 3,
    createdAt: "2025-03-20"
  },
  {
    id: "4",
    title: "Mediterranean Diet",
    description: "Heart-healthy eating plan based on Mediterranean cuisine",
    category: "general-health",
    targetCalories: 2000,
    mealCount: 4,
    duration: 60,
    assignedTo: 0,
    createdAt: "2025-03-25"
  },
  {
    id: "5",
    title: "Plant-Based Nutrition",
    description: "Complete vegan meal planning for optimal nutrition",
    category: "vegetarian",
    targetCalories: 1900,
    mealCount: 4,
    duration: 30,
    assignedTo: 1,
    createdAt: "2025-04-01"
  }
];

// Mock categories for filtering
const categories = [
  { value: "all", label: "All Categories" },
  { value: "weight-loss", label: "Weight Loss" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "medical", label: "Medical Conditions" },
  { value: "general-health", label: "General Health" },
  { value: "vegetarian", label: "Vegetarian/Vegan" }
];

const DietitianPlans = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [plans, setPlans] = useState(mockPlans);
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: "",
    description: "",
    category: "general-health",
    targetCalories: "2000",
    mealCount: "3",
    duration: "30"
  });
  const { toast } = useToast();
  
  const handleNewPlanChange = (field: string, value: string) => {
    setNewPlan({
      ...newPlan,
      [field]: value
    });
  };
  
  const handleCreatePlan = () => {
    // In a real app, this would send data to a backend
    const id = `plan_${Math.random().toString(36).substring(2, 11)}`;
    const createdPlan = {
      id,
      title: newPlan.title,
      description: newPlan.description,
      category: newPlan.category,
      targetCalories: parseInt(newPlan.targetCalories),
      mealCount: parseInt(newPlan.mealCount),
      duration: parseInt(newPlan.duration),
      assignedTo: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };
    
    setPlans([createdPlan, ...plans]);
    setShowNewPlanDialog(false);
    toast({
      title: "Plan created",
      description: `"${newPlan.title}" has been created successfully.`,
    });
    
    // Reset the form
    setNewPlan({
      title: "",
      description: "",
      category: "general-health",
      targetCalories: "2000",
      mealCount: "3",
      duration: "30"
    });
  };
  
  // Filter plans based on search term, active tab, and category
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = 
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || plan.category === selectedCategory;
    
    const matchesTab = activeTab === "templates" || 
      (activeTab === "assigned" && plan.assignedTo > 0);
      
    return matchesSearch && matchesCategory && matchesTab;
  });
  
  const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-nourish-dark mb-2">Diet Plans</h1>
        <p className="text-gray-600">
          Create and manage diet plan templates for your patients
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="templates">All Templates</TabsTrigger>
            <TabsTrigger value="assigned">Assigned Plans</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
          <DialogTrigger asChild>
            <Button className="bg-nourish-primary hover:bg-nourish-dark">
              <Plus className="mr-2 h-4 w-4" />
              Create New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Diet Plan Template</DialogTitle>
              <DialogDescription>
                Create a new diet plan template that can be assigned to patients
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Plan Title</Label>
                <Input 
                  id="title" 
                  value={newPlan.title}
                  onChange={(e) => handleNewPlanChange("title", e.target.value)}
                  placeholder="Enter plan title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPlan.description}
                  onChange={(e) => handleNewPlanChange("description", e.target.value)}
                  placeholder="Brief description of this diet plan"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newPlan.category}
                  onValueChange={(value) => handleNewPlanChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat.value !== 'all').map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Target Calories</Label>
                  <Input 
                    id="calories" 
                    type="number"
                    value={newPlan.targetCalories}
                    onChange={(e) => handleNewPlanChange("targetCalories", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mealCount">Meals Per Day</Label>
                  <Input 
                    id="mealCount" 
                    type="number"
                    value={newPlan.mealCount}
                    onChange={(e) => handleNewPlanChange("mealCount", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Input 
                    id="duration" 
                    type="number"
                    value={newPlan.duration}
                    onChange={(e) => handleNewPlanChange("duration", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewPlanDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePlan}
                className="bg-nourish-primary hover:bg-nourish-dark"
                disabled={!newPlan.title}
              >
                Create Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search plans..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-500 mb-1">No plans found</h3>
            <p className="text-gray-400 text-sm">
              Try changing your filters or create a new plan
            </p>
          </div>
        ) : (
          filteredPlans.map(plan => (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{plan.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        Assign to Patient
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Plan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="text-sm line-clamp-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Category</div>
                    <div className="font-medium">{getCategoryLabel(plan.category)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Calories</div>
                    <div className="font-medium">{plan.targetCalories} kcal</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Meals per day</div>
                    <div className="font-medium">{plan.mealCount}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-medium">{plan.duration} days</div>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Created: {plan.createdAt}
                  </div>
                  {plan.assignedTo > 0 && (
                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                      {plan.assignedTo} {plan.assignedTo === 1 ? 'patient' : 'patients'}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DietitianPlans;
