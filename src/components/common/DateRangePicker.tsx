// DateRangePicker.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  getDay,
} from 'date-fns';

interface DateRangePickerProps {
  onRange: (range: { start: Date | null; end: Date | null }) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onRange,
  initialStartDate = null,
  initialEndDate = null,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

  useEffect(() => {
    // Call the onRange callback whenever startDate or endDate changes
    onRange({ start: startDate, end: endDate });
  }, [startDate, endDate, onRange]);

  const generateDays = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

    const firstDayOfWeek = getDay(firstDayOfMonth);
    const leadingDays = Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1).fill(null);

    return [...leadingDays, ...daysInMonth];
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (date < startDate) {
      setEndDate(startDate);
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleMonthChange = (increment: number) => {
    setCurrentDate((prevDate) => (increment > 0 ? addMonths(prevDate, 1) : subMonths(prevDate, 1)));
  };

  const displayRangeText = startDate
    ? endDate
      ? `${format(startDate, 'do MMMM, yyyy')} - ${format(endDate, 'do MMMM, yyyy')}`
      : `${format(startDate, 'do MMMM, yyyy')} - Pending`
    : 'No date range selected';

  return (
    <div className="bg-white rounded-lg p-4 w-75 space-y-4">
      {/* Display the selected range as small grey text */}

      <div className="flex justify-between items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleMonthChange(-1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <h2 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleMonthChange(1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {generateDays().map((day, index) => {
          const isCurrentMonth = day && isSameMonth(day, currentDate);
          const isSelected =
            startDate && endDate && day
              ? isWithinInterval(day, { start: startDate, end: endDate })
              : false;
          const isRangeEnd =
            day &&
            ((startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate)));

          return (
            <motion.button
              key={day ? day.toString() : `empty-${index}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDateClick(day)}
              disabled={!day}
              className={`
                p-2 rounded-lg text-sm
                ${!day ? 'invisible' : ''}
                ${isCurrentMonth ? '' : 'text-gray-400'}
                ${isSelected ? 'bg-gray-200 text-black' : 'hover:bg-gray-100'}
                ${isRangeEnd ? 'bg-gray-500 text-white' : ''}
              `}
            >
              {day ? format(day, 'd') : ''}
            </motion.button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 text-center">
        {displayRangeText}
      </p>
    </div>
  );
};

export default DateRangePicker;
