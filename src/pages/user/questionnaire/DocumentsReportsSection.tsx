
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Upload, AlertCircle } from "lucide-react";
import { QuestionnaireFormData } from "./types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DocumentsReportsSectionProps {
  formData: QuestionnaireFormData;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileType: "photos" | "medicalReports") => void;
  removeFile: (index: number, fileType: "photos" | "medicalReports") => void;
  errors: Record<string, string>;
}

export const DocumentsReportsSection: React.FC<DocumentsReportsSectionProps> = ({
  formData,
  handleFileChange,
  removeFile,
  errors
}) => {
  return (
    <>
      <div className="mt-4">
        <Label className="flex items-center mb-1">
          Photo Submission <span className="text-red-500 ml-1">*</span>
        </Label>
        <p className="text-sm text-gray-500 mb-2">
          Please upload 3 standing photos (Front, Side, Back) and 1 close-up of your face.
        </p>
        
        {errors.photos && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errors.photos}</AlertDescription>
          </Alert>
        )}
        
        <Input
          type="file"
          onChange={(e) => handleFileChange(e, "photos")}
          accept="image/*"
          multiple
          className={`mb-4 ${errors.photos ? "border-red-500" : ""}`}
        />

        {formData.photos.length > 0 && (
          <div className="mb-6">
            <Label className="block mb-2">Uploaded Photos: {formData.photos.length}</Label>
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
                    onClick={() => removeFile(index, "photos")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Label className="block mb-1">
          Medical Reports (Optional)
        </Label>
        <p className="text-sm text-gray-500 mb-2">
          Upload any recent blood reports or medical findings that might help in your assessment.
        </p>
        <Input
          type="file"
          onChange={(e) => handleFileChange(e, "medicalReports")}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          multiple
          className="mb-4"
        />

        {formData.medicalReports && formData.medicalReports.length > 0 && (
          <div>
            <Label className="block mb-2">Uploaded Reports: {formData.medicalReports.length}</Label>
            <div className="space-y-2">
              {formData.medicalReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between border rounded-md p-2">
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm truncate max-w-[200px] md:max-w-[300px]">
                      {report.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index, "medicalReports")}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: If you experience any issues uploading files, please reduce the file size or try a different image format.</p>
      </div>
    </>
  );
};
