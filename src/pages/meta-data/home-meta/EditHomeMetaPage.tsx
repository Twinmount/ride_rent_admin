import { fetchHomeMetaDataById } from "@/api/meta-data";
import HomeMetaForm from "@/components/form/HomeMetaForm";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";

import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditHomeMetaPage() {
  const navigate = useNavigate();

  const { metaDataId } = useParams<{ metaDataId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["home-meta-data", metaDataId],
    queryFn: () => fetchHomeMetaDataById(metaDataId as string),
  });

  const metaData = data?.result;

  return (
    <section className="container pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h3 className="h3-bold text-center sm:text-left">Edit Home Meta</h3>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <HomeMetaForm type="Update" formData={metaData} />
      )}
    </section>
  );
}
