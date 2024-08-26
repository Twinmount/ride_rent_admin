import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormLabel, FormItem } from '@/components/ui/form'

type MultiSelectDropdownProps = {
  value?: string[]
  onChangeHandler: (value: string[]) => void
  placeholder?: string
  options: { label: string; value: string }[]
  isDisabled?: boolean
  uniqueValue: string // added unique value prop
}

const MultiSelectDropdown = ({
  value = [],
  onChangeHandler,
  placeholder = 'option',
  options,
  isDisabled = false,
  uniqueValue, // destructure the unique value prop
}: MultiSelectDropdownProps) => {
  const handleCheckboxChange = (checkedValue: string, checked: boolean) => {
    if (checked) {
      onChangeHandler([...value, checkedValue])
    } else {
      onChangeHandler(value.filter((val) => val !== checkedValue))
    }
  }

  return (
    <AccordionItem value={uniqueValue}>
      <AccordionTrigger disabled={isDisabled} className="hover:no-underline">
        {`Choose ${placeholder}`}
      </AccordionTrigger>
      <AccordionContent>
        {options.length > 0 &&
          options.map((option) => (
            <FormItem
              key={option.value}
              className="flex items-center gap-2 mb-1"
            >
              <FormControl className="">
                <Checkbox
                  checked={value.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option.value, !!checked)
                  }
                  className="bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none mt-2"
                />
              </FormControl>
              <FormLabel className="">{option.label}</FormLabel>
            </FormItem>
          ))}
      </AccordionContent>
    </AccordionItem>
  )
}

export default MultiSelectDropdown
