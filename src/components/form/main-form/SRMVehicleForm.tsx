import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getSRMVehicleFormDefaultValue } from "@/constants";
import { PrimaryFormSchema } from "@/lib/validator";
import { PrimaryFormType, SRMVehicleFormType } from "@/types/formTypes";
import "react-international-phone/style.css";
import RentalDetailsFormField from "../RentalDetailsFormField";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useFormValidationToast } from "@/hooks/useFormValidationToast";
import { showSuccessToast } from "@/utils/toastUtils";

import { FormContainer } from "../form-ui/FormContainer";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { updateSRMVehicle } from "@/api/srm";

type SRMVehicleFormProps = {
  type: "Add" | "Update";
  formData?: SRMVehicleFormType | null;
};

export default function SRMVehicleForm({
  type,
  formData,
}: SRMVehicleFormProps) {
  const { vehicleId } = useParams<{
    vehicleId: string;
  }>();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const initialValues = formData ? formData : getSRMVehicleFormDefaultValue();

  // Define your form.
  const form = useForm<z.infer<typeof PrimaryFormSchema>>({
    resolver: zodResolver(PrimaryFormSchema),
    defaultValues: initialValues as PrimaryFormType,
    shouldFocusError: true,
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof PrimaryFormSchema>) {
    // Append other form data
    try {
      let data;

      if (type === "Add") {
        // console.log(values);
      } else if (type === "Update") {
        data = await updateSRMVehicle(vehicleId as string, values);
      }

      if (data) {
        showSuccessToast(type);
        queryClient.invalidateQueries({
          queryKey: ["listings", vehicleId],
          exact: false,
        });
        navigate("/srm/vehicles");
      }
    } catch (error) {
      const apiError = error as ApiError;

      if (
        apiError.response?.data?.error?.message ===
        "We already have a vehicle registered with this registration number"
      ) {
        form.setError("vehicleRegistrationNumber", {
          type: "manual",
          message:
            "This registration number is already registered. Please use a different one.",
        });
        form.setFocus("vehicleRegistrationNumber");
      } else {
        toast({
          variant: "destructive",
          title: `${type} Vehicle failed`,
          description: "Something went wrong",
        });
      }
      console.error(error);
    }
  }

  // custom hook to validate complex form fields
  useFormValidationToast(form);

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {/* Rental Details */}
        <FormField
          control={form.control}
          name="rentalDetails"
          render={() => {
            return (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base font-semibold lg:text-lg">
                  Rental Details <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <RentalDetailsFormField isIndia={false} />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Provide rent details. At least one of "day," "week," or
                    "month" must be selected.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            );
          }}
        />

        {/* Submit */}
        <FormSubmitButton
          text={type === "Add" ? "Add Vehicle" : "Update Vehicle"}
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}
