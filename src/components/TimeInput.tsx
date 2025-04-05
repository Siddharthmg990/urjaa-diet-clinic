
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

interface TimeInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({ 
  id, 
  value, 
  onChange, 
  placeholder = "HH:MM AM/PM",
  className
}) => {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Format time input as user types
  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Remove any non-alphanumeric characters except for :, A, P, M
    newValue = newValue.replace(/[^0-9:APM\s]/gi, '');
    
    // Auto-format as user types
    if (newValue.length === 2 && !newValue.includes(':') && !value.includes(':')) {
      newValue += ':';
    }
    
    // Convert to uppercase for AM/PM
    newValue = newValue.toUpperCase();
    
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleTimeInput}
        placeholder={placeholder}
        className={`pl-9 ${className}`}
        maxLength={10} // Limit to HH:MM AM/PM format
      />
      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  );
};
