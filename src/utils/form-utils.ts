// utils/submitForm.ts
import { addPrimaryDetailsForm, updatePrimaryDetailsForm } from "@/api/vehicle";
import { deleteMultipleFiles } from "@/helpers/form";
import { sanitizeStringToSlug } from "@/lib/utils";
import { PrimaryFormType } from "@/types/formTypes";

export const handleLevelOneFormSubmission = async (
  type: "Add" | "Update",
  values: PrimaryFormType,
  {
    countryCode,
    userId,
    vehicleId,
    isCarsCategory,
    deletedFiles,
  }: {
    countryCode: string;
    userId?: string;
    vehicleId?: string;
    isCarsCategory: boolean;
    deletedFiles: string[];
  }
) => {
  const formattedSeries = sanitizeStringToSlug(values.vehicleSeries);
  const payload = {
    ...values,
    vehicleSeries: formattedSeries, // Ensure it's correctly sanitized
  };

  // console.log("Payload:", payload);

  let data;
  if (type === "Add") {
    data = await addPrimaryDetailsForm(
      payload,
      countryCode,
      userId as string,
      isCarsCategory
    );
  } else if (type === "Update") {
    data = await updatePrimaryDetailsForm(
      vehicleId as string,
      payload,
      countryCode,
      isCarsCategory
    );
  }

  if (data) {
    await deleteMultipleFiles(deletedFiles);
  }

  return data;
};
