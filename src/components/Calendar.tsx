import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export type Range = { from?: Date; to?: Date };

export default function Calendar({
  value, onChange, disabled,
}: {
  value: Range;
  onChange: (r: Range) => void;
  disabled?: (date: Date) => boolean;
}){
  return (
    <DayPicker
      mode="range"
      selected={value}
      onSelect={(r)=> onChange(r || {})}
      disabled={disabled}
      ISOWeek
    />
  );
}
