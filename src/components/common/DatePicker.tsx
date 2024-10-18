import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, LucideCalendarClock } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  setYear,
  setMonth,
  getDay,
} from 'date-fns';

interface DatePickerProps {
  onDateSelect: (date: Date) => void;
  initialDate: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelect, initialDate }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [days, setDays] = useState<(Date | null)[]>([]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);

  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  useEffect(() => {
    generateDays();
  }, [currentDate]);

  const generateDays = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

    const firstDayOfWeek = getDay(firstDayOfMonth);
    const leadingDays = Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1).fill(null);

    setDays([...leadingDays, ...daysInMonth]);
  };

  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleMonthChange = (increment: number) => {
    setCurrentDate((prevDate) =>
      increment > 0 ? addMonths(prevDate, 1) : subMonths(prevDate, 1)
    );
  };

  const handleYearClick = (year: number) => {
    setCurrentDate(setYear(currentDate, year));
    setIsYearPickerOpen(false);
  };

  const handleMonthClick = (month: number) => {
    setCurrentDate(setMonth(currentDate, month));
    setIsMonthPickerOpen(false);
  };

  const toggleYearPicker = () => {
    setIsYearPickerOpen(!isYearPickerOpen);
    setIsMonthPickerOpen(false);
  };

  const toggleMonthPicker = () => {
    setIsMonthPickerOpen(!isMonthPickerOpen);
    setIsYearPickerOpen(false);
  };

  return (
    <motion.div
      className="bg-white rounded-lg p-0 w-75"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleMonthChange(-1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex flex-row items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMonthPicker}
            className="font-semibold text-lg"
          >
            {format(currentDate, 'MMMM')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleYearPicker}
            className="text-sm text-gray-600"
          >
            {format(currentDate, 'yyyy')}
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleMonthChange(1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isYearPickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bg-white shadow-lg rounded-lg p-2 z-10 border border-black"
          >
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {years.map((year) => (
                <motion.button
                  key={year}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleYearClick(year)}
                  className={`p-2 rounded ${
                    year === currentDate.getFullYear() ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {year}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMonthPickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bg-white shadow-lg rounded-lg p-2 z-10 border border-black"
          >
            <div className="grid grid-cols-4 gap-2">
              {months.map((month, index) => (
                <motion.button
                  key={month}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMonthClick(index)}
                  className={`p-2 rounded ${
                    index === currentDate.getMonth()
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {month.slice(0, 3)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day && isSameMonth(day, currentDate);
          const isSelected = selectedDate && day && isSameDay(day, selectedDate);
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
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isSelected ? 'bg-black text-white' : 'hover:bg-gray-100'}
              `}
            >
              {day ? format(day, 'd') : ''}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
            const date = selectedDate || currentDate;
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            onDateSelect(utcDate);
          }}
        className="flex flex-row items-center justify-center w-full mt-4 bg-black text-white py-2 rounded-lg font-medium"
      >
        <LucideCalendarClock className="w-4 h-4 mr-2" />
        Set Date
      </motion.button>
    </motion.div>
  );
};

export default DatePicker;
