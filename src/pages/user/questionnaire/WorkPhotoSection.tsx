
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TimeInput } from "@/components/TimeInput";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { QuestionnaireFormData } from "./types";

interface WorkPhotoSectionProps {
  formData: QuestionnaireFormData;
  handleChange: (field: string, value: any) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
  errors: Record<string, string>;
}

export const WorkPhotoSection: React.FC<WorkPhotoSectionProps> = ({
  formData,
  handleChange,
  handleFileChange,
  removePhoto,
  errors
}) => {
  return (
    <>
      <div>
        <Label htmlFor="profession" className="flex items-center mb-1">
          Profession <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select
          value={formData.profession}
          onValueChange={(value) => handleChange("profession", value)}
        >
          <SelectTrigger className={errors.profession ? "border-red-500" : ""}>
            <SelectValue placeholder="Select your profession" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="working">Working Professional</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.profession && (
          <p className="text-red-500 text-sm mt-1">{errors.profession}</p>
        )}
      </div>

      {(formData.profession === "working" || formData.profession === "other") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="leaveHomeTime" className="flex items-center mb-1">
              What time do you leave home? <span className="text-red-500 ml-1">*</span>
            </Label>
            <TimeInput
              id="leaveHomeTime"
              value={formData.leaveHomeTime}
              onChange={(value) => handleChange("leaveHomeTime", value)}
              placeholder="HH:MM AM/PM"
            />
            {errors.leaveHomeTime && (
              <p className="text-red-500 text-sm mt-1">{errors.leaveHomeTime}</p>
            )}
          </div>
          <div>
            <Label htmlFor="returnHomeTime" className="flex items-center mb-1">
              What time do you return? <span className="text-red-500 ml-1">*</span>
            </Label>
            <TimeInput
              id="returnHomeTime"
              value={formData.returnHomeTime}
              onChange={(value) => handleChange("returnHomeTime", value)}
              placeholder="HH:MM AM/PM"
            />
            {errors.returnHomeTime && (
              <p className="text-red-500 text-sm mt-1">{errors.returnHomeTime}</p>
            )}
          </div>
        </div>
      )}

      {formData.profession === "student" && (
        <div>
          <Label htmlFor="breakTimes" className="flex items-center mb-1">
            What are your break/interval timings? <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="breakTimes"
            value={formData.breakTimes}
            onChange={(e) => handleChange("breakTimes", e.target.value)}
            placeholder="Ex: 11:00 AM - 11:15 AM, 1:00 PM - 1:45 PM"
            className={errors.breakTimes ? "border-red-500" : ""}
          />
          {errors.breakTimes && (
            <p className="text-red-500 text-sm mt-1">{errors.breakTimes}</p>
          )}
        </div>
      )}

      <div className="mt-4">
        <Label className="block mb-2">
          Photo Submission (Optional but recommended)
        </Label>
        <p className="text-sm text-gray-500 mb-2">
          Please upload 3 standing photos (Front, Side, Back) and 1 close-up of your face.
        </p>
        <Input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="mb-4"
        />

        {formData.photos.length > 0 && (
          <div>
            <Label className="block mb-2">Uploaded Photos:</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group border rounded-md p-1">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Uploaded photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-70 group-hover:opacity-100"
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
