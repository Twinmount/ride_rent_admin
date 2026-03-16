import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export type DayWorkingHours = {
  day: string;
  isClosed: boolean;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "18:00"
};

type WorkingHoursPickerProps = {
  value?: DayWorkingHours[];
  onChange?: (val: DayWorkingHours[]) => void;
};

export const DEFAULT_WORKING_HOURS: DayWorkingHours[] = [
  { day: "Monday", isClosed: false, startTime: "09:00", endTime: "18:00" },
  { day: "Tuesday", isClosed: false, startTime: "09:00", endTime: "18:00" },
  { day: "Wednesday", isClosed: false, startTime: "09:00", endTime: "18:00" },
  { day: "Thursday", isClosed: false, startTime: "09:00", endTime: "18:00" },
  { day: "Friday", isClosed: false, startTime: "09:00", endTime: "18:00" },
  { day: "Saturday", isClosed: true, startTime: "09:00", endTime: "18:00" },
  { day: "Sunday", isClosed: true, startTime: "09:00", endTime: "18:00" },
];

export const WorkingHoursPicker = ({ value, onChange }: WorkingHoursPickerProps) => {
  const [hours, setHours] = useState<DayWorkingHours[]>(value?.length ? value : DEFAULT_WORKING_HOURS);

  useEffect(() => {
    if (value && value.length > 0) {
      setHours(value);
    }
  }, [value]);

  const updateDay = (index: number, field: keyof DayWorkingHours, val: any) => {
    const updated = [...hours];
    updated[index] = { ...updated[index], [field]: val };
    setHours(updated);
    if (onChange) onChange(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {hours.map((item, index) => (
        <div key={item.day} className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2 w-32">
            <Switch
              checked={!item.isClosed}
              onCheckedChange={(checked) => updateDay(index, "isClosed", !checked)}
            />
            <Label className={item.isClosed ? "text-muted-foreground" : "font-medium"}>
              {item.day}
            </Label>
          </div>

          {!item.isClosed ? (
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={item.startTime}
                onChange={(e) => updateDay(index, "startTime", e.target.value)}
                title={`Start time for ${item.day}`}
                className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="time"
                value={item.endTime}
                onChange={(e) => updateDay(index, "endTime", e.target.value)}
                title={`End time for ${item.day}`}
                className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic mr-4">Holiday</div>
          )}
        </div>
      ))}
    </div>
  );
};
