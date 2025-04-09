
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    height: "",
    weight: "",
    birthdate: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        // Fetch the most recent health assessment
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('health_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        setFormData({
          name: profileData?.name || user?.name || "",
          email: user?.email || "",
          phone: profileData?.phone || "",
          address: profileData?.address || "",
          height: profileData?.height || assessmentData?.height || "",
          weight: profileData?.weight || assessmentData?.weight || "",
          birthdate: profileData?.birthdate ? new Date(profileData.birthdate).toISOString().split('T')[0] : ""
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.id) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          address: formData.address,
          height: formData.height,
          weight: formData.weight,
          birthdate: formData.birthdate || null
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-nourish-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-nourish-dark mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and preferences
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-nourish-primary mr-2" />
                  <Label htmlFor="name">Full Name</Label>
                </div>
                {isEditing ? (
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-gray-700">{formData.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-nourish-primary mr-2" />
                  <Label htmlFor="email">Email</Label>
                </div>
                {isEditing ? (
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={formData.email} 
                    disabled
                  />
                ) : (
                  <p className="text-gray-700">{formData.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-nourish-primary mr-2" />
                  <Label htmlFor="phone">Phone Number</Label>
                </div>
                {isEditing ? (
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone} 
                    disabled
                  />
                ) : (
                  <p className="text-gray-700">{formData.phone || "Not provided"}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-nourish-primary mr-2" />
                  <Label htmlFor="address">Address</Label>
                </div>
                {isEditing ? (
                  <Input 
                    id="address" 
                    name="address"
                    value={formData.address} 
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-gray-700">{formData.address || "Not provided"}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
            <CardDescription>
              Your basic health metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                {isEditing ? (
                  <Input 
                    id="height" 
                    name="height"
                    value={formData.height} 
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-gray-700">{formData.height ? `${formData.height} cm` : "Not provided"}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                {isEditing ? (
                  <Input 
                    id="weight" 
                    name="weight"
                    value={formData.weight} 
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-gray-700">{formData.weight ? `${formData.weight} kg` : "Not provided"}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthdate">Date of Birth</Label>
                {isEditing ? (
                  <Input 
                    id="birthdate" 
                    name="birthdate"
                    type="date" 
                    value={formData.birthdate} 
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-gray-700">{formData.birthdate || "Not provided"}</p>
                )}
              </div>
              
              <Separator className="my-4" />
              
              {formData.height && formData.weight && (
                <div>
                  <Label>BMI Calculation</Label>
                  <p className="text-gray-700">
                    {(parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2)).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Body Mass Index = weight(kg) / height(m)²
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-nourish-primary hover:bg-nourish-dark"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="bg-nourish-primary hover:bg-nourish-dark"
            disabled={isLoading}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
