// utils/submitForm.ts
import { addPrimaryDetailsForm, updatePrimaryDetailsForm } from "@/api/vehicle";
import { deleteMultipleFiles } from "@/helpers/form";
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
  },
) => {
  let data;
  if (type === "Add") {
    data = await addPrimaryDetailsForm(
      values,
      countryCode,
      userId as string,
      isCarsCategory,
    );
  } else if (type === "Update") {
    data = await updatePrimaryDetailsForm(
      vehicleId as string,
      values,
      countryCode,
      isCarsCategory,
    );
  }

  if (data) {
    await deleteMultipleFiles(deletedFiles);
  }

  return data;
};

/**
 * Clear a file input field by its ID
 * @param inputId - The HTML element ID of the file input
 * @returns boolean - true if cleared successfully, false otherwise
 */
export function clearFileInput(inputId: string): boolean {
  try {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;

    if (fileInput && fileInput.type === "file") {
      fileInput.value = "";
      return true;
    }

    console.warn(`File input with id "${inputId}" not found`);
    return false;
  } catch (error) {
    console.error("Error clearing file input:", error);
    return false;
  }
}

/**
 * Validate if a file format is accepted or not.
 * @param file - The file being checked
 * @param acceptedFormats - An array of accepted file formats
 * @returns boolean - true if the file format is accepted, false otherwise
 */
export const validateFileFormat = (
  file: File,
  acceptedFormats: string[],
): boolean => {
  if (!acceptedFormats || acceptedFormats.length === 0) {
    return true; // No format restriction
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
    return false;
  }

  return true;
};
