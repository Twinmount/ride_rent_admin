import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginFormSchema } from "@/lib/validator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Spinner from "@/components/general/Spinner";
import { toast } from "@/components/ui/use-toast";
import { register } from "@/api/auth";
import { useAdminContext } from "@/context/AdminContext";
import RegisterCountryDropdown from "@/components/RegisterCountryDropdown";

const Register = ({ country }: { country: string }) => {
  const navigate = useNavigate();

  const { updateAppCountry } = useAdminContext();

  useEffect(() => {
    updateAppCountry(country);
  }, []);

  // Retrieve stored values from sessionStorage
  const storedPhoneNumber = sessionStorage.getItem("phoneNumber") || "";
  const storedCountryCode = sessionStorage.getItem("countryCode") || "";
  const storedPassword = sessionStorage.getItem("password") || "";

  const [countryCode, setCountryCode] = useState(storedCountryCode);

  const initialValues = {
    phoneNumber: storedCountryCode + storedPhoneNumber,
    password: storedPassword,
  };

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    try {
      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, "")
        .trim();

      const data = await register(values, countryCode);

      if (data) {
        sessionStorage.setItem("otpId", data?.result.otpId);
        sessionStorage.setItem("userId", data?.result.userId);

        // Store phoneNumber, countryCode, and password separately in sessionStorage
        sessionStorage.setItem("phoneNumber", phoneNumber);
        sessionStorage.setItem("countryCode", countryCode);
        sessionStorage.setItem("password", values.password);

        navigate(country === "in" ? "/in/verify-otp" : "/uae/verify-otp");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error.message;

        if (typeof errorMessage === "string") {
          form.setError("phoneNumber", {
            type: "manual",
            message: "mobile already registered",
          });
        } else if (errorMessage[0]?.constraints?.IsCustomPhoneNumber) {
          form.setError("phoneNumber", {
            type: "manual",
            message: "mobile number is invalid",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Something went wrong. ",
        });
      }
    }
  }

  return (
    <section
      className="flex-center relative h-screen bg-gray-100"
      style={{
        backgroundImage: `url('/assets/img/bg/register-banner.webp')`,
        backgroundSize: "cover", // This ensures the image covers the div
        backgroundPosition: "center", // This centers the background image
        backgroundRepeat: "no-repeat", // Prevent the image from repeating
      }}
    >
      <div className="absolute right-4 top-6 z-20">
        <RegisterCountryDropdown country={country} type="register" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-[500px] flex-1 rounded-[1rem] bg-white p-4 pb-6 shadow-lg max-sm:max-w-[95%]"
        >
          <h3 className="mb-4 text-center text-3xl font-bold text-yellow">
            Admin Register
          </h3>
          <div className="mx-auto flex w-full max-w-full flex-col gap-5 md:max-w-[800px]">
            {/* mobile / whatsapp*/}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="mb-2 flex w-full flex-col">
                  <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                    Mobile
                  </FormLabel>
                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <PhoneInput
                        defaultCountry={country === "in" ? "in" : "ae"}
                        value={field.value}
                        onChange={(value, country) => {
                          field.onChange(value);
                          setCountryCode(country.country.dialCode);
                        }}
                        className="flex items-center"
                        inputClassName="input-field !w-full !text-base"
                        placeholder="WhatsApp number"
                        countrySelectorStyleProps={{
                          className:
                            "bg-white !border-none outline-none !rounded-xl  mr-1 !text-lg",
                          style: {
                            border: "none ",
                          },
                          buttonClassName:
                            "!border-none outline-none !h-[52px] !w-[50px] !rounded-xl bg-gray-100",
                        }}
                      />
                    </FormControl>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />

            {/* password field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-2 flex w-full flex-col">
                  <FormLabel className="ml-2 flex w-72 justify-between text-base lg:text-lg">
                    Password
                  </FormLabel>
                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        className={`input-field !text-lg`}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="flex-center button hover:bg-darkYellow col-span-2 mx-auto mt-2 w-full bg-yellow !text-lg !font-semibold"
            >
              Send OTP {form.formState.isSubmitting && <Spinner />}
            </Button>
          </div>
          <div className="mt-3 flex justify-end px-2">
            <div>
              Existing admin?{" "}
              <Link
                to={country === "in" ? "/in/login" : "/uae/login"}
                className="font-semibold text-yellow"
              >
                Login
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default Register;
