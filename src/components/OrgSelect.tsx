import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { orgs } from '@/constants'
import { useAdminContext } from '@/context/AdminContext'

export function OrgSelect() {
  const { org, setOrg } = useAdminContext()

  const handleOrgChange = (value: string) => {
    const selectedOrg = orgs.find((o) => o.value === value)
    if (selectedOrg) {
      setOrg(selectedOrg)
    }
  }

  return (
    <Select defaultValue={org.value} onValueChange={handleOrgChange}>
      <SelectTrigger className="w-full mx-auto font-semibold text-white bg-gray-900 ring-0 focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-[101] ">
        <SelectGroup>
          <SelectLabel className="font-bold">Choose Org</SelectLabel>
          {orgs.map((org) => (
            <SelectItem
              className={`cursor-pointer font-semibold ${org.value}`}
              key={org.id}
              value={org.value}
            >
              {org.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
