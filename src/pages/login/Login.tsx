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
import { LoginPageDefaultValues } from "@/constants";
import { LoginFormSchema } from "@/lib/validator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// phone input
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Spinner from "@/components/general/Spinner";
import { API } from "@/api/ApiService";
import { Slug } from "@/api/Api-Endpoints";
import { toast } from "@/components/ui/use-toast";
import { clear, save, StorageKeys } from "@/utils/storage";
import { LoginResponse } from "@/types/api-types/API-types";
import { Eye, EyeOff } from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";
import RegisterCountryDropdown from "@/components/RegisterCountryDropdown";

const LoginPage = ({ country }: { country: string }) => {
  const [isView, setIsView] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const navigate = useNavigate();

  const { updateAppCountry } = useAdminContext();

  useEffect(() => {
    updateAppCountry(country);
  }, []);

  const initialValues = LoginPageDefaultValues;

  // for phone validation

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: initialValues,
  });

  // Define a submit handler
  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    try {
      // Extract the phone number part without the country code
      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, "")
        .trim();

      // Construct the final request body to send to the backend
      const requestBody = {
        countryCode,
        phoneNumber,
        password: values.password,
      };

      const data = await API.post<LoginResponse>({
        slug: Slug.LOGIN,
        body: requestBody,
      });

      if (data) {
        clear();
        save(StorageKeys.ACCESS_TOKEN, data.result.token);
        save(StorageKeys.REFRESH_TOKEN, data.result.refreshToken);
        updateAppCountry(country);
        navigate("/");
      }
    } catch (error: any) {
      console.error("error : ", error);
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          title: "Login Failed!",
          description: "Invalid mobile number or password",
        });
        form.setError("phoneNumber", {
          type: "manual",
          message: "",
        });
        form.setError("password", {
          type: "manual",
          message: "",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "something went wrong :(",
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
        <RegisterCountryDropdown country={country} type="login" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-[500px] flex-1 rounded-[1rem] bg-white p-4 pb-6 shadow-lg max-sm:max-w-[95%]"
        >
          <h3 className="mb-4 text-center text-3xl font-bold text-yellow">
            Admin Login
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

                          // Set the country code in state
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
                      <div className="relative">
                        <Input
                          type={isView ? "text" : "password"}
                          id="password"
                          className={`input-field !text-lg`}
                          placeholder="password"
                          {...field}
                        />
                        {isView ? (
                          <Eye
                            className="absolute right-4 top-4 z-10 cursor-pointer text-gray-500"
                            onClick={() => {
                              setIsView(!isView);
                            }}
                          />
                        ) : (
                          <EyeOff
                            className="absolute right-4 top-4 z-10 cursor-pointer text-gray-500"
                            onClick={() => setIsView(!isView)}
                          />
                        )}
                      </div>
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
              Login {form.formState.isSubmitting && <Spinner />}
            </Button>
          </div>
          <div className="mt-3 flex justify-end px-2">
            <div>
              New admin?{" "}
              <Link
                to={country === "in" ? "/in/register" : "/ae/register"}
                className="font-semibold text-yellow"
              >
                Register
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default LoginPage;
