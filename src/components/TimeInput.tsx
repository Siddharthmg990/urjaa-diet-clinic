
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  // Parse initial value if it exists
  const parseTime = (timeString: string) => {
    let hour = '';
    let minute = '';
    let period = 'AM';

    // Extract time components from string like "10:30 AM"
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      hour = timeMatch[1];
      minute = timeMatch[2];
      if (timeMatch[3]) {
        period = timeMatch[3].toUpperCase();
      }
    }

    return {
      hour: hour || '',
      minute: minute || '',
      period
    };
  };

  const initialTime = parseTime(value);
  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);
  const [period, setPeriod] = useState(initialTime.period);

  // Update the parent component whenever time changes
  useEffect(() => {
    if (hour) {
      const formattedTime = `${hour}:${minute} ${period}`;
      onChange(formattedTime);
    }
  }, [hour, minute, period, onChange]);

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    return num.toString();
  });

  // Generate minute options (00-55, step 5)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => {
    const num = i * 5;
    return num.toString().padStart(2, '0');
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            id={id}
            type="text"
            value={value || placeholder}
            readOnly
            className={`pl-9 cursor-pointer ${className}`}
          />
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Hour</label>
            <Select value={hour} onValueChange={setHour}>
              <SelectTrigger>
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hourOptions.map(h => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Minute</label>
            <Select value={minute} onValueChange={setMinute}>
              <SelectTrigger>
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {minuteOptions.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">AM/PM</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
