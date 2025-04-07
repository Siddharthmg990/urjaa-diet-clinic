
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionnaireFormData } from "./types";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalInfoSectionProps {
  formData: QuestionnaireFormData;
  handleChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

// Common Indian cities for autocomplete
const popularCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", 
  "Ahmedabad", "Pune", "Surat", "Jaipur", "Lucknow", "Kanpur", 
  "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", 
  "Vadodara", "Ghaziabad", "Ludhiana", "Coimbatore", "Agra", "Madurai", 
  "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", 
  "Aurangabad", "Dhanbad", "Amritsar", "Allahabad", "Ranchi", "Howrah", 
  "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Raipur", "Kota"
];

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  formData, 
  handleChange,
  errors
}) => {
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow positive numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    handleChange("age", value);
  };

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div>
        <Label htmlFor="fullName" className="flex items-center">
          Full Name <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Enter your full name"
          required
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      <div>
        <Label htmlFor="city" className="flex items-center">
          City of Residence <span className="text-red-500 ml-1">*</span>
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className={`flex h-10 w-full items-center justify-between rounded-md border ${errors.city ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer`}>
              {formData.city ? (
                <span>{formData.city}</span>
              ) : (
                <span className="text-muted-foreground">Select city...</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search city..." className="h-9" />
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-y-auto">
                {popularCities.map((city) => (
                  <CommandItem
                    key={city}
                    value={city}
                    onSelect={(currentValue) => {
                      handleChange("city", currentValue);
                      setOpen(false);
                    }}
                  >
                    {city}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        formData.city === city ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age" className="flex items-center">
            Age <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="age"
            type="text"
            inputMode="numeric"
            value={formData.age}
            onChange={handleAgeChange}
            placeholder="Years"
            required
            className={errors.age ? "border-red-500" : ""}
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age}</p>
          )}
        </div>
        
        <div>
          <Label className="flex items-center">
            Sex <span className="text-red-500 ml-1">*</span>
          </Label>
          <RadioGroup
            value={formData.sex}
            onValueChange={(value) => handleChange("sex", value)}
            className="flex gap-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
          {errors.sex && (
            <p className="text-red-500 text-sm mt-1">{errors.sex}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height" className="flex items-center">
            Height <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id="height"
              value={formData.height}
              onChange={(e) => handleChange("height", e.target.value)}
              placeholder="Enter your height"
              className={`flex-1 ${errors.height ? "border-red-500" : ""}`}
              required
            />
            <Select 
              value={formData.heightUnit}
              onValueChange={(value) => handleChange("heightUnit", value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feet">ft/in</SelectItem>
                <SelectItem value="cm">cm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.height && (
            <p className="text-red-500 text-sm mt-1">{errors.height}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="weight" className="flex items-center">
            Weight <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              placeholder="Enter your weight"
              className={`flex-1 ${errors.weight ? "border-red-500" : ""}`}
              required
            />
            <Select 
              value={formData.weightUnit}
              onValueChange={(value) => handleChange("weightUnit", value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lbs">lbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
          )}
        </div>
      </div>
    </>
  );
};
