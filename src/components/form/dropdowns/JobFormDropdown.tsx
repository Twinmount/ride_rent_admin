import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type JobDropdownType = {
  label: string;
  value: string;
}[];

type JobFormDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  type: "location" | "level" | "experience" | "country";
};

export const workTypeOptions: JobDropdownType = [
  { value: "Remote", label: "Remote" },
  { value: "Onsite", label: "Onsite" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Freelance", label: "Freelance" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Part-time", label: "Part-time" },
  { value: "Full-time", label: "Full-time" },
  { value: "Temporary", label: "Temporary" },
  { value: "Project-based", label: "Project-based" },
];

export const experienceLevelOptions: JobDropdownType = [
  { value: "Intern / Trainee", label: "Intern / Trainee" },
  { value: "Entry-Level / Junior", label: "Entry-Level / Junior" },
  { value: "Associate / Mid-Level", label: "Associate / Mid-Level" },
  { value: "Senior-Level", label: "Senior-Level" },
  { value: "Lead / Principal", label: "Lead / Principal" },
  { value: "Manager / Team Lead", label: "Manager / Team Lead" },
  { value: "Director", label: "Director" },
  { value: "VP / Vice President", label: "VP / Vice President" },
  {
    value: "C-Level (e.g., CTO, CFO, CEO)",
    label: "C-Level (e.g., CTO, CFO, CEO)",
  },
];

export const yearExperienceOptions: JobDropdownType = [
  { value: "1-2 yrs", label: "1-2 yrs" },
  { value: "2-3 yrs", label: "2-3 yrs" },
  { value: "3-4 yrs", label: "3-4 yrs" },
  { value: "4-5 yrs", label: "4-5 yrs" },
  { value: "5-6 yrs", label: "5-6 yrs" },
  { value: "6-7 yrs", label: "6-7 yrs" },
  { value: "7-8 yrs", label: "7-8 yrs" },
  { value: "8-9 yrs", label: "8-9 yrs" },
  { value: "9-10 yrs", label: "9-10 yrs" },
  { value: "10-11 yrs", label: "10-11 yrs" },
  { value: "11-12 yrs", label: "11-12 yrs" },
  { value: "12-13 yrs", label: "12-13 yrs" },
  { value: "13-14 yrs", label: "13-14 yrs" },
  { value: "14-15 yrs", label: "14-15 yrs" },
  { value: "15-16 yrs", label: "15-16 yrs" },
];

export const countryList: JobDropdownType = [
  { value: "UAE", label: "UAE" },
  { value: "INDIA", label: "INDIA" },
];

const JobFormDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
  type,
}: JobFormDropdownProps) => {
  let jobOptionList: JobDropdownType = [];

  if (type === "location") {
    jobOptionList = workTypeOptions;
  } else if (type === "level") {
    jobOptionList = experienceLevelOptions;
  } else if (type === "experience") {
    jobOptionList = yearExperienceOptions;
  } else if (type === "country") {
    jobOptionList = countryList;
  }

  return (
    <Select
      onValueChange={onChangeHandler}
      defaultValue={value}
      disabled={isDisabled}
    >
      <SelectTrigger className="select-field input-fields ring-0 focus:ring-0">
        <SelectValue
          className="!font-bold !text-black"
          placeholder="Choose Blog Category"
        />
      </SelectTrigger>
      <SelectContent>
        {jobOptionList?.map((tag, index) => (
          <SelectItem
            key={index}
            value={tag.value} // The value returned to the form
            className="select-item p-regular-14"
          >
            {tag.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default JobFormDropdown;
