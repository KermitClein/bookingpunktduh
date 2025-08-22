'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function MonthCalendar({
  bookedDays,
}: {
  bookedDays: Date[];
}) {
  return (
    <DayPicker
      mode="single"
      modifiers={{ booked: bookedDays }}
      modifiersClassNames={{ booked: 'bg-red-100 text-red-700 rounded-full' }}
      weekStartsOn={1}
    />
  );
}
