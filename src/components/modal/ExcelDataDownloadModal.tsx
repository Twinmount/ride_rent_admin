import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { fetchAllStates } from '@/api/states'
import { downloadCompanyData, downloadVehicleData } from '@/api/excel-data'
import { toast } from '../ui/use-toast'
import { CloudDownload } from 'lucide-react'

type StateType = {
  stateId: string
  stateName: string
  stateValue: string
}

const ExcelDataDownloadModal = () => {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null)
  const [selectedStateName, setSelectedStateName] = useState<string | null>(
    null
  )

  const { data: statesData, isLoading: isStatesLoading } = useQuery({
    queryKey: ['states'],
    queryFn: fetchAllStates,
  })

  const handleDownloadVehicleData = async () => {
    if (selectedStateId && selectedStateName) {
      try {
        await downloadVehicleData(selectedStateId, selectedStateName)
      } catch (error) {
        alert('Error downloading vehicle data')
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Choose a state to download',
      })
    }
  }

  const handleDownloadCompanyData = async () => {
    try {
      await downloadCompanyData()
    } catch (error) {
      alert('Error downloading company data')
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        tabIndex={-1}
        className="w-full gap-2 mt-2 font-semibold text-white transition-colors bg-gray-900 border rounded-lg hover:bg-yellow hover:text-white h-9 flex-center"
      >
        Download
        <CloudDownload />
      </DialogTrigger>
      <DialogContent className="max-w-lg p-8 mx-auto transition-all duration-300 ease-out transform bg-white shadow-lg h-fit rounded-2xl max-sm:max-w-[95%]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Excel Data Download
          </DialogTitle>
        </DialogHeader>

        {/* Tabs for Vehicle Data and Company Data */}
        <Tabs defaultValue="vehicle-data" className="w-full mt-1">
          <TabsList className="w-full h-12 p-0 mb-6 overflow-hidden bg-transparent border border-gray-200 rounded-xl">
            <TabsTrigger
              value="vehicle-data"
              className="w-full h-full font-semibold text-gray-700 rounded-none rounded-r-lg focus:bg-blue-100 focus:text-blue-700"
            >
              Vehicle
            </TabsTrigger>
            <TabsTrigger
              value="company-data"
              className="w-full h-full font-semibold text-gray-700 rounded-none rounded-l-lg focus:bg-blue-100 focus:text-blue-700"
            >
              Company
            </TabsTrigger>
          </TabsList>

          {/* Vehicle Data Tab Content */}
          <TabsContent value="vehicle-data">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select a state to download vehicle data:
              </p>
              {/* States Dropdown */}
              <Select
                onValueChange={(value) => {
                  const selectedState = statesData?.result.find(
                    (state: StateType) => state.stateId === value
                  )
                  setSelectedStateId(selectedState?.stateId || null)
                  setSelectedStateName(selectedState?.stateName || null)
                }}
                disabled={isStatesLoading}
              >
                <SelectTrigger className="w-full border-gray-300 rounded-md ring-0 focus:ring-0">
                  <SelectValue placeholder="Choose state" />
                </SelectTrigger>
                <SelectContent className="z-[110] border-gray-200 absolute max-md:max-h-44">
                  {statesData?.result.map((state: StateType) => (
                    <SelectItem key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Download Button for Vehicle Data */}
              <Button
                onClick={handleDownloadVehicleData}
                className="w-full py-2 mt-4 text-white rounded-md shadow-md bg-yellow hover:bg-yellow flex-center gap-x-2"
              >
                Download Vehicle Data <CloudDownload />
              </Button>
            </div>
          </TabsContent>

          {/* Company Data Tab Content */}
          <TabsContent value="company-data">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Click below to download company data:
              </p>
              {/* Download Button for Company Data */}
              <Button
                onClick={handleDownloadCompanyData}
                className="w-full py-2 mt-4 text-white rounded-md shadow-md bg-yellow hover:bg-yellow flex-center gap-x-2"
              >
                Download Company Data <CloudDownload />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default ExcelDataDownloadModal
