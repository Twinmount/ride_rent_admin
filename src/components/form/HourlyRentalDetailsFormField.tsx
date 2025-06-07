// HourlyRentalDetailFormField.tsx
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Infinity } from "lucide-react";

const HourlyRentalDetailFormField = ({
  isIndia = false,
  isDisabled = false,
}: {
  isIndia: boolean;
  isDisabled?: boolean;
}) => {
  const { control, watch, clearErrors } = useFormContext();
  const isEnabled = watch("rentalDetails.hour.enabled");

  return (
    <div className="mb-2 rounded-lg border-b p-2 shadow">
      <Controller
        name="rentalDetails.hour.enabled"
        control={control}
        render={({ field }) => (
          <div className="mt-3 flex items-center space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={(value) => {
                field.onChange(value);
                if (!value) {
                  clearErrors([`rentalDetails`]);
                }
              }}
              className="h-5 w-5 bg-white data-[state=checked]:border-none data-[state=checked]:bg-yellow"
              id="rentalDetails-hour-enabled"
            />
            <label
              htmlFor="rentalDetails-hour-enabled"
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Hour{" "}
              <span className="text-sm italic text-gray-700">
                &#40;select to set hourly rental rates. Optional&#41;
              </span>
            </label>
          </div>
        )}
      />

      {isEnabled && (
        <>
          {/* Minimum Required Booking (Select) */}
          <Controller
            name="rentalDetails.hour.minBookingHours"
            control={control}
            render={({ field }) => (
              <div className="mt-4 flex items-start space-x-2">
                <label className="flex w-36 items-start font-medium max-md:text-sm">
                  Minimum Booking Hours <span className="mt-3">:</span>
                </label>
                <div className="flex w-full flex-col">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      clearErrors("rentalDetails");
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="select-field input-fields ring-0 focus:ring-0">
                      <SelectValue
                        className="!font-bold !text-black"
                        placeholder="Select hour"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, index) => (
                        <SelectItem
                          key={index + 1}
                          value={(index + 1).toString()}
                        >
                          {index + 1} hour{index + 1 > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the minimum required booking hours (1–10 hours).
                  </FormDescription>
                </div>
              </div>
            )}
          />

          {/* Rent in AED */}
          <Controller
            name="rentalDetails.hour.rentInAED"
            control={control}
            render={({ field }) => (
              <div className="mt-4 flex items-center space-x-2">
                <label className="w-36 font-medium">
                  Rent in {isIndia ? "INR" : "AED"}:
                </label>
                <div className="flex w-full flex-col">
                  <Input
                    {...field}
                    placeholder={
                      isIndia ? "Enter rent in INR" : "Enter rent in AED"
                    }
                    className="input-field"
                    type="text"
                    inputMode="numeric"
                    onKeyDown={(e) => {
                      if (
                        !/^\d*$/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors(`rentalDetails`);
                    }}
                  />
                  <FormDescription>
                    Specify the hourly rental price in{" "}
                    {isIndia ? "INR." : "AED."}
                  </FormDescription>
                </div>
              </div>
            )}
          />

          {/* Mileage Limit */}
          <Controller
            name="rentalDetails.hour.mileageLimit"
            control={control}
            render={({ field }) => (
              <div className="mt-4 flex items-center space-x-2">
                <label className="w-36 font-medium">Mileage Limit:</label>
                <div className="flex w-full flex-col">
                  <Input
                    {...field}
                    placeholder="Enter mileage limit"
                    className="input-field"
                    type="text"
                    inputMode="numeric"
                    onKeyDown={(e) => {
                      if (
                        !/^\d*$/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors(`rentalDetails`);
                    }}
                  />
                  <FormDescription>
                    Specify the mileage limit for hourly rentals &#40;in
                    KM&#41;.
                  </FormDescription>
                </div>
              </div>
            )}
          />

          {/* is unlimited */}
          <Controller
            name={`rentalDetails.hour.unlimitedMileage`}
            control={control}
            render={({ field }) => (
              <div className="ml-24 mt-4 flex w-fit max-w-full flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(value) => field.onChange(value)}
                    className="h-5 w-5 bg-white data-[state=checked]:border-none data-[state=checked]:bg-yellow"
                    id="rentalDetails-hour-unlimitedMileage"
                    disabled={isDisabled}
                  />
                  <label
                    htmlFor="rentalDetails-hour-unlimitedMileage"
                    className="flex-center gap-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Unlimited Mileage <Infinity className="text-yellow" />
                  </label>
                </div>
                <FormDescription>
                  Check this box if the vehicle has no mileage limit.
                </FormDescription>
              </div>
            )}
          />
        </>
      )}
    </div>
  );
};

export default HourlyRentalDetailFormField;
