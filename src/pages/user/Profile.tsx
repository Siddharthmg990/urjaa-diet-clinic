
import { useState } from "react";
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

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "555-123-4567", // Demo value
    address: "123 Main Street, Anytown, USA", // Demo value
    height: "175", // cm
    weight: "70", // kg
    birthdate: "1990-01-01"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    // In a real app, this would send data to a backend
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-gray-700">{formData.phone}</p>
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
                  <p className="text-gray-700">{formData.address}</p>
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
                <Label htmlFor="height">Height (cm)</Label>
                {isEditing ? (
                  <Input 
                    id="height" 
                    name="height"
                    type="number" 
                    value={formData.height} 
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-gray-700">{formData.height} cm</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                {isEditing ? (
                  <Input 
                    id="weight" 
                    name="weight"
                    type="number" 
                    value={formData.weight} 
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-gray-700">{formData.weight} kg</p>
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
                  <p className="text-gray-700">{formData.birthdate}</p>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <Label>BMI Calculation</Label>
                <p className="text-gray-700">
                  {(parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2)).toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">
                  Body Mass Index = weight(kg) / height(m)²
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-nourish-primary hover:bg-nourish-dark">
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="bg-nourish-primary hover:bg-nourish-dark">
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
