import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type BlogCategoriesDropdownProps = {
  value?: string
  onChangeHandler: (value: string) => void
  placeholder?: string
  isDisabled?: boolean
}

const BlogCategoriesDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
}: BlogCategoriesDropdownProps) => {
  const categoryTags = [
    { label: 'Design', value: 'design' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Automotive', value: 'automotive' },
    { label: 'News', value: 'news' },
    { label: 'Travel', value: 'travel' },
  ]

  return (
    <Select
      onValueChange={onChangeHandler}
      defaultValue={value}
      disabled={isDisabled}
    >
      <SelectTrigger className="select-field ring-0 focus:ring-0 input-fields">
        <SelectValue
          className="!font-bold !text-black"
          placeholder="Choose Blog Category"
        />
      </SelectTrigger>
      <SelectContent>
        {categoryTags.map((tag, index) => (
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
  )
}

export default BlogCategoriesDropdown
