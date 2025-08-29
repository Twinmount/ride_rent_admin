import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/common/PageLayout";
import SRMVehicleForm from "@/components/form/main-form/SRMVehicleForm";
import { RentalDetailsFormFieldType } from "@/types/formTypes";

export default function SRMVehicleEditPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RentalDetailsFormFieldType | null>(
    null,
  );

  useEffect(() => {
    if (!vehicleId) {
      navigate("/srm/vehicles");
      return;
    }

    const stored = sessionStorage.getItem(`rentalDetails-${vehicleId}`);
    if (stored) {
      try {
        setFormData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse rentalDetails from sessionStorage", e);
        navigate("/srm/vehicles");
      }
    } else {
      navigate("/srm/vehicles");
    }
  }, [vehicleId, navigate]);

  if (!formData) {
    return (
      <PageLayout heading="Loading..." shouldRenderNavigation>
        <div className="text-center text-gray-500">
          Loading Rental Details...
        </div>
      </PageLayout>
    );
  }

  const formDataProp = {
    rentalDetails: formData,
  };

  return (
    <PageLayout heading="Update Rental Details" shouldRenderNavigation>
      <SRMVehicleForm type="Update" formData={formDataProp} />
    </PageLayout>
  );
}
