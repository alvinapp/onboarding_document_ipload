// ModernDateRangePicker.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from './Button';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import DateRangePicker from './DateRangePicker';
import { LucideCalendarClock } from 'lucide-react';

interface ModernDateRangePickerProps {
    onRangeChange: (range: { start: Date; end: Date }) => void;
    initialRange?: { start: Date; end: Date };
}

const ModernDateRangePicker: React.FC<ModernDateRangePickerProps> = ({
    onRangeChange,
    initialRange,
}) => {
    const [selectedRange, setSelectedRange] = useState<{
        start: Date | null;
        end: Date | null;
    }>({
        start: initialRange?.start || null,
        end: initialRange?.end || null,
    });
    const [tempRange, setTempRange] = useState<{
        start: Date | null;
        end: Date | null;
    }>({
        start: initialRange?.start || null,
        end: initialRange?.end || null,
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleRangeSelect = (range: { start: Date | null; end: Date | null }) => {
        setTempRange(range);
    };

    const handleConfirm = () => {
        if (tempRange.start && tempRange.end) {
            setSelectedRange({ start: tempRange.start, end: tempRange.end });
            onRangeChange({ start: tempRange.start, end: tempRange.end });
            setIsOpen(false); // Close the popover after confirming the date range
        }
    };

    const displayText =
        selectedRange.start && selectedRange.end
            ? `${format(selectedRange.start, 'PPP')} - ${format(selectedRange.end, 'PPP')}`
            : 'Select date range';

    return (
        <div className="space-y-1">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="link"
                        className="justify-start text-left font-normal text-blue-600"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        Select Date Range
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <DateRangePicker
                        onRange={handleRangeSelect}
                        initialStartDate={tempRange.start || new Date(new Date().setDate(new Date().getDate() - 7))}
                        initialEndDate={tempRange.end || new Date()}
                    />
                    <div className="flex justify-end mt-2 p-2">
                        <Button onClick={handleConfirm} disabled={!tempRange.start || !tempRange.end}>
                            <LucideCalendarClock className="w-4 h-4 mr-2" />
                            Set Date Range
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Conditionally render the selected range as a subtext */}
            {selectedRange.start && selectedRange.end && (
                <p className="text-sm text-gray-500">
                    {format(selectedRange.start, 'do MMMM, yyyy')} - {format(selectedRange.end, 'do MMMM, yyyy')}
                </p>
            )}
        </div>
    );
};

export default ModernDateRangePicker;
