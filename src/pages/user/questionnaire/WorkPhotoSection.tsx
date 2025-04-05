
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeInput } from "@/components/TimeInput";
import { QuestionnaireFormData } from "./types";

interface WorkPhotoSectionProps {
  formData: QuestionnaireFormData;
  handleChange: (field: string, value: any) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
}

export const WorkPhotoSection: React.FC<WorkPhotoSectionProps> = ({ 
  formData, 
  handleChange, 
  handleFileChange, 
  removePhoto 
}) => {
  return (
    <>
      <div>
        <Label htmlFor="profession">Profession</Label>
        <Select 
          value={formData.profession}
          onValueChange={(value) => handleChange("profession", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your profession" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="working">Working Professional</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.profession === "working" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="leaveHomeTime">What time do you leave home?</Label>
            <TimeInput
              id="leaveHomeTime"
              value={formData.leaveHomeTime}
              onChange={(value) => handleChange("leaveHomeTime", value)}
              placeholder="HH:MM AM/PM"
            />
          </div>
          <div>
            <Label htmlFor="returnHomeTime">What time do you return?</Label>
            <TimeInput
              id="returnHomeTime"
              value={formData.returnHomeTime}
              onChange={(value) => handleChange("returnHomeTime", value)}
              placeholder="HH:MM AM/PM"
            />
          </div>
        </div>
      )}

      {formData.profession === "student" && (
        <div>
          <Label htmlFor="breakTimes">What are your break/interval timings?</Label>
          <Textarea
            id="breakTimes"
            value={formData.breakTimes}
            onChange={(e) => handleChange("breakTimes", e.target.value)}
            placeholder="Specify all break times during school/college"
            rows={3}
          />
        </div>
      )}

      <div>
        <Label className="mb-2 block">Photo Submission (Optional but recommended)</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Please upload 3 standing photos (Front, Side, Back) and 1 close-up of your face.
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          <Label 
            htmlFor="photoUpload" 
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload photos</p>
              <p className="text-xs text-gray-400">Front, Side, Back and Face</p>
            </div>
            <Input 
              id="photoUpload" 
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </Label>
        </div>

        {formData.photos.length > 0 && (
          <div className="mt-4">
            <Label className="mb-2 block">Uploaded Photos</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(photo)} 
                    alt={`Uploaded photo ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-5 w-5 rounded-full"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
