import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { blogPromotionPlacement } from "@/constants";

type BlogPromotionPlacementDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  isDisabled?: boolean;
};

const BlogPromotionPlacementDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
}: BlogPromotionPlacementDropdownProps) => {
  return (
    <Select
      onValueChange={onChangeHandler}
      defaultValue={value}
      disabled={isDisabled}
    >
      <SelectTrigger className="select-field input-fields ring-0 focus:ring-0">
        <SelectValue
          className="!font-bold !text-black"
          placeholder="Choose Blog Placement"
        />
      </SelectTrigger>
      <SelectContent>
        {blogPromotionPlacement.map((tag, index) => (
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

export default BlogPromotionPlacementDropdown;
