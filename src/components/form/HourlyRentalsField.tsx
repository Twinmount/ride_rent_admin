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

const HourlyRentalsField = () => {
  const { control, watch } = useFormContext();
  const isEnabled = watch("hourlyRentals.enabled");

  return (
    <div className="p-2 mb-2 rounded-lg border-b shadow">
      {/* Hourly Rentals Checkbox */}
      <Controller
        name="hourlyRentals.enabled"
        control={control}
        render={({ field }) => (
          <div className="flex items-center mt-3 space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
              className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
              id="hourlyRentals-enabled"
            />
            <label
              htmlFor="hourlyRentals-enabled"
              className="text-base font-medium leading-none"
            >
              Available for Hourly Rentals?
            </label>
          </div>
        )}
      />

      {/* Conditionally Rendered Fields */}
      {isEnabled && (
        <div className="p-4 mt-4 space-y-4 rounded-lg">
          {/* Minimum Required Booking (Select) */}
          <Controller
            name="hourlyRentals.minBookingHours"
            control={control}
            render={({ field }) => (
              <div className="flex items-start space-x-2">
                <label className="w-36 font-medium">
                  Minimum Booking Hours:
                </label>
                <div className="flex flex-col w-full">
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="ring-0 select-field focus:ring-0 input-fields">
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
                  <FormDescription className="">
                    Select the minimum required booking hours (1–10 hours).
                  </FormDescription>
                </div>
              </div>
            )}
          />

          {/* Rent in AED */}
          <Controller
            name="hourlyRentals.rentInAED"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <label className="w-36 font-medium">Rent in AED:</label>
                <div className="flex flex-col w-full">
                  <Input
                    {...field}
                    placeholder="Enter rent in AED"
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
                  />
                  <FormDescription className="">
                    Specify the hourly rental price in AED.
                  </FormDescription>
                </div>
              </div>
            )}
          />

          {/* Mileage Limit */}
          <Controller
            name="hourlyRentals.mileageLimit"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <label className="w-36 font-medium">Mileage Limit:</label>
                <div className="flex flex-col w-full">
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
                  />
                  <FormDescription>
                    Specify the mileage limit for hourly rentals &#40;in
                    KM&#41;.
                  </FormDescription>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default HourlyRentalsField;
