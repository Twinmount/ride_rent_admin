import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VehicleGeneralCategories } from '@/constants'
import { useEffect, useState } from 'react'

type DropdownProps = {
  value?: string
  onChangeHandler?: () => void
  placeholder?: string
  isDisabled?: boolean
}

type VehicleCategory = {
  id: string | number
  label: string
  value: string
}
const FormDropdown = ({
  value,
  onChangeHandler,
  placeholder = 'option',
  isDisabled = false,
}: DropdownProps) => {
  const [categories, setCategories] = useState<VehicleCategory[]>([])

  useEffect(() => {
    // Simulate data fetching delay
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setCategories(VehicleGeneralCategories)
    }

    fetchData()
  }, [])

  return (
    <Select
      onValueChange={onChangeHandler}
      defaultValue={value}
      disabled={isDisabled}
    >
      <SelectTrigger className="select-field ring-0 focus:ring-0 input-fields">
        <SelectValue
          className="!font-bold !text-black"
          placeholder={`Choose ${placeholder}`}
        />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.value}
              className="select-item p-regular-14"
            >
              {category.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
export default FormDropdown
