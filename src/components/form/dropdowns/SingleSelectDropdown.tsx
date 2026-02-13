import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

type SingleSelectDropdownProps<T extends string> = {
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function SingleSelectDropdown<T extends string>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
}: SingleSelectDropdownProps<T>) {
  return (
    <Select disabled={disabled} value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`select-field input-fields text-left ring-0 focus:ring-0 ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
