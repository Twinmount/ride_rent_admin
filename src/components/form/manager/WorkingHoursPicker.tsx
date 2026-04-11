import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export type DayWorkingHours = {
  day: string;
  isClosed: boolean;
  is24Hours?: boolean;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "18:00"
};

type WorkingHoursPickerProps = {
  value?: DayWorkingHours[];
  onChange?: (val: DayWorkingHours[]) => void;
};

export const DEFAULT_WORKING_HOURS: DayWorkingHours[] = [
  { day: "Monday", isClosed: false, is24Hours: false, startTime: "09:00", endTime: "18:00" },
  { day: "Tuesday", isClosed: false, is24Hours: false, startTime: "09:00", endTime: "18:00" },
  { day: "Wednesday", isClosed: false, is24Hours: false, startTime: "09:00", endTime: "18:00" },
  { day: "Thursday", isClosed: false, is24Hours: false, startTime: "09:00", endTime: "18:00" },
  { day: "Friday", isClosed: false, is24Hours: false, startTime: "09:00", endTime: "18:00" },
  { day: "Saturday", isClosed: true, is24Hours: false, startTime: "09:00", endTime: "18:00" },
  { day: "Sunday", isClosed: true, is24Hours: false, startTime: "09:00", endTime: "18:00" },
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
          <div className="flex items-center gap-2 w-36">
            <Switch
              checked={!item.isClosed}
              onCheckedChange={(checked) => updateDay(index, "isClosed", !checked)}
            />
            <Label className={item.isClosed ? "text-muted-foreground" : "font-medium"}>
              {item.day}
            </Label>
          </div>

          {!item.isClosed ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Switch
                  checked={!!item.is24Hours}
                  onCheckedChange={(checked) => updateDay(index, "is24Hours", checked)}
                  className="scale-75"
                />
                <Label className="text-xs text-muted-foreground whitespace-nowrap cursor-pointer" onClick={() => updateDay(index, "is24Hours", !item.is24Hours)}>
                  24 Hrs
                </Label>
              </div>

              <div className={`flex items-center gap-2 transition-opacity duration-200 ${item.is24Hours ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                <input
                  type="time"
                  value={item.startTime}
                  onChange={(e) => updateDay(index, "startTime", e.target.value)}
                  disabled={!!item.is24Hours}
                  title={`Start time for ${item.day}`}
                  className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="time"
                  value={item.endTime}
                  onChange={(e) => updateDay(index, "endTime", e.target.value)}
                  disabled={!!item.is24Hours}
                  title={`End time for ${item.day}`}
                  className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic mr-4">Holiday</div>
          )}
        </div>
      ))}
    </div>
  );
};
