import LocationForm from "@/components/form/StateForm";
import { useAdminContext } from "@/context/AdminContext";

import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AddLocationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { country } = useAdminContext();
  const countryName = country.countryName;

  const parentState = searchParams.get("parentStateName") || null;
  const parentStateId = searchParams.get("parentStateId") || null;

  return (
    <section className="container pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h3 className="h3-bold text-center sm:text-left">
          Add New Location {!!parentState && `in ${parentState}`} under{" "}
          {countryName}
        </h3>
      </div>
      <LocationForm type="Add" parentStateId={parentStateId} />
    </section>
  );
}
