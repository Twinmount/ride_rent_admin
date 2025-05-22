import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  advisorBlogCategoryTags,
  CategoryTagsType,
  rideBlogCategoryTags,
} from "@/constants";

type BlogCategoriesDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  type: "ride" | "advisor";
};

const BlogCategoriesDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
  type,
}: BlogCategoriesDropdownProps) => {
  let categories: CategoryTagsType = [];

  if (type === "ride") {
    categories = rideBlogCategoryTags;
  } else if (type === "advisor") {
    categories = advisorBlogCategoryTags;
  }

  // filter out "all"
  categories = categories.filter((tag) => tag.value !== "all");

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
        {categories.map((tag, index) => (
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

export default BlogCategoriesDropdown;
