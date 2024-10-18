import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from './Button';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import DatePicker from './DatePicker';

interface ModernDatepickerProps {
  onDateChange: (date: Date) => void;
  dueDate?: any;
}

const ModernDatepicker: React.FC<ModernDatepickerProps> = ({ onDateChange, dueDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(dueDate === 'N/A' ? null : dueDate || null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
    setIsOpen(false); // Close the popover after selecting a date
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className="justify-start text-left font-normal text-blue-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedDate ? format(selectedDate, 'PPP') : 'Set due date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DatePicker onDateSelect={handleDateSelect} initialDate={selectedDate || new Date()} />
      </PopoverContent>
    </Popover>
  );
};

export default ModernDatepicker;
