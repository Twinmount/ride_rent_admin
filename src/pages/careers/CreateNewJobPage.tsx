import RideBlogForm from "@/components/form/main-form/RideBlogForm";
import { useAdminContext } from "@/context/AdminContext";

import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateNewJobPage() {
  const navigate = useNavigate();
  const { country } = useAdminContext();

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
          Add New Job {country.countryName}
        </h3>
      </div>
      <RideBlogForm type="Add" />
    </section>
  );
}
