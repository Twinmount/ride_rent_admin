import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesById } from "@/api/vehicle-series";
import VehicleSeriesForm from "@/components/form/VehicleSeriesForm";

export default function EditBrandPage() {
  const { vehicleSeriesId } = useParams<{
    vehicleSeriesId: string;
  }>();

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle-series-by-id", vehicleSeriesId],
    queryFn: () => fetchSeriesById(vehicleSeriesId as string),
  });

  const formData = data?.result;

  return (
    <section className="container min-h-screen pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="h3-bold text-center sm:text-left">Update Series</h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <VehicleSeriesForm type="Update" formData={formData} />
      )}
    </section>
  );
}
