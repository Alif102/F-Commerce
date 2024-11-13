import React, { useState } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';

const CalendarIcon = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Toggle calendar visibility
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  // Render a simple calendar grid (example, replace with your logic)
  const renderCalendar = () => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const dates = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
      <div className="border p-4 bg-white rounded shadow-lg w-64">
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div key={day} className="font-bold text-center">{day}</div>
          ))}
          {dates.map((date) => (
            <div key={date} className="text-center">{date}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Calendar Icon */}
      <FaRegCalendarAlt
        size={24}
        className="text-blue-500 cursor-pointer"
        onClick={toggleCalendar}
      />

      {/* Calendar */}
      {isCalendarOpen && (
        <div className="absolute top-8 left-0 z-10">
          {renderCalendar()}
        </div>
      )}
    </div>
  );
};

export default CalendarIcon;
