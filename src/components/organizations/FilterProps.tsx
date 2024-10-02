import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select";
import { Button } from "../common/Button";
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover";
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const stages = [
  "Request a customer needs analysis call",
  "Scoping & Product Phasing Plan",
  "Pricing Model & Partnership Agreement",
  "SLA signing",
  "Integration and deployment",
  "UAT",
  "Deployed"
];

interface FilterDropdownProps {
  onFilter: (filters: { startDate: Date | null; endDate: Date | null; stage: string }) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFilter }) => {
  const [stage, setStage] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleFilter = () => {
    onFilter({ 
      startDate: dateRange?.from || null, 
      endDate: dateRange?.to || null, 
      stage 
    });
  };

  const formatDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    return 'Select date range';
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger id="stage-select">
            <SelectValue placeholder="Select a stage" />
          </SelectTrigger>
          <SelectContent>
            {stages.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={(range: DateRange | undefined) => setDateRange(range)}
            className="border-none"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            // Customize CSS for navigation buttons
          />
        </PopoverContent>
      </Popover>
      <Button onClick={handleFilter} className="w-full">
        Apply Filters
      </Button>
    </div>
  );
};