import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function AgentSearchRadio({
  searchType,
  setSearchType,
}: {
  searchType: 'name' | 'id'
  setSearchType: (value: 'name' | 'id') => void
}) {
  return (
    <RadioGroup
      value={searchType}
      onValueChange={setSearchType}
      defaultValue="name"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="name" id="r1" />
        <Label htmlFor="r1">Name</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="id" id="r2" />
        <Label htmlFor="r2">ID</Label>
      </div>
    </RadioGroup>
  )
}
