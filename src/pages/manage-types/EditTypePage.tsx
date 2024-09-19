import VehicleTypeForm from '@/components/form/VehicleTypesForm'
import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import FormSkelton from '@/components/skelton/FormSkelton'
import { useQuery } from '@tanstack/react-query'
import { fetchCategoryById } from '@/api/vehicle-categories'
import { fetchVehicleTypeById } from '@/api/vehicle-types'

export default function UpdateTypesPage() {
  const { vehicleCategoryId, vehicleTypeId } = useParams<{
    vehicleCategoryId: string
    vehicleTypeId: string
  }>()

  const navigate = useNavigate()

  const { data: vehicleCategory, isLoading: isVehicleCategoryLoading } =
    useQuery({
      queryKey: ['category', vehicleCategoryId],
      queryFn: () => fetchCategoryById(vehicleCategoryId as string),
      enabled: !!vehicleCategoryId,
    })

  const categoryName = vehicleCategory?.result?.name || 'Category'

  const { data: vehicleTypeData, isLoading } = useQuery({
    queryKey: ['vehicle-type', vehicleTypeId],
    queryFn: () => fetchVehicleTypeById(vehicleTypeId as string),
  })

  return (
    <section className="container min-h-screen pt-5 pb-32">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">Update Type</h1>
      </div>
      {isVehicleCategoryLoading || isLoading ? (
        <FormSkelton />
      ) : (
        <VehicleTypeForm
          type="Update"
          category={categoryName}
          formData={vehicleTypeData?.result}
        />
      )}
    </section>
  )
}
