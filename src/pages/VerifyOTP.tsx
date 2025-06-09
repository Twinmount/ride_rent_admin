import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OTPFormSchema } from "@/lib/validator";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/general/Spinner";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { resendOTP, verifyOTP } from "@/api/auth";
import { save, StorageKeys } from "@/utils/storage";
import { useAdminContext } from "@/context/AdminContext";

const VerifyOTP = ({ country }: { country: string }) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);

  const { updateAppCountry } = useAdminContext();

  useEffect(() => {
    updateAppCountry(country);
  }, []);

  const form = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: { otp: "" },
  });

  // resend otp timer
  useEffect(() => {
    const storedTimestamp = sessionStorage.getItem("otpTimestamp");
    const currentTime = Math.floor(Date.now() / 1000);

    if (storedTimestamp) {
      const elapsedTime = currentTime - parseInt(storedTimestamp, 10);
      setTimer(Math.max(60 - elapsedTime, 0));
    } else {
      sessionStorage.setItem("otpTimestamp", currentTime.toString());
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // resend otp mutation function
  const { mutateAsync: resendOTPMutation, isPending } = useMutation({
    mutationFn: () => {
      const phoneNumber = sessionStorage.getItem("phoneNumber") as string;
      const countryCode = sessionStorage.getItem("countryCode") as string;
      const password = sessionStorage.getItem("password") as string;
      return resendOTP({ phoneNumber, countryCode, password });
    },
    onSuccess: (data) => {
      sessionStorage.setItem("otpId", data?.result.otpId);
      sessionStorage.setItem("userId", data?.result.userId);
      toast({
        title: "OTP Sent",
        description: "A new OTP has been sent to your number.",
        className: "bg-yellow text-white",
      });
      const currentTime = Math.floor(Date.now() / 1000);
      sessionStorage.setItem("otpTimestamp", currentTime.toString());
      setTimer(60);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to Resend OTP",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  // on submit function
  async function onSubmit(values: z.infer<typeof OTPFormSchema>) {
    try {
      const otpId = sessionStorage.getItem("otpId");
      const userId = sessionStorage.getItem("userId");

      const requestBody = {
        otpId,
        userId,
        otp: values.otp,
      };

      const data = await verifyOTP(
        requestBody as {
          otpId: string;
          userId: string;
          otp: string;
        },
      );

      if (data) {
        sessionStorage.clear();
        save(StorageKeys.ACCESS_TOKEN, data.result.token);
        save(StorageKeys.REFRESH_TOKEN, data.result.refreshToken);
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error.message;
        form.setError("otp", { type: "manual", message: errorMessage });
      } else {
        toast({
          variant: "destructive",
          title: "OTP Verification Failed",
          description: "Something went wrong.",
        });
      }
    }
  }
  return (
    <section className="flex-center h-screen bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-[500px] flex-1 rounded-3xl bg-white p-4 pb-6 shadow-lg"
        >
          <h3 className="mb-4 text-center text-3xl font-bold text-yellow">
            OTP Verification
          </h3>
          <div className="mx-auto flex w-full max-w-full flex-col md:max-w-[800px]">
            {/* otp field */}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="mb-2 flex w-full flex-col items-center">
                  <FormControl>
                    <InputOTP maxLength={4} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-center">
                    Please enter the OTP sent to your{" "}
                    <span className="font-bold">whatsapp</span> number.
                    <br />
                    OTP is valid for only 10 minutes
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </FormItem>
              )}
            />

            <div className="flex-between mt-2 h-fit px-2 text-yellow">
              <Link
                to={"/register"}
                className="text-sm font-semibold hover:underline"
              >
                change number?
              </Link>

              <Button
                onClick={() => resendOTPMutation()}
                disabled={isPending || timer > 0}
                className={`h-fit w-fit bg-transparent text-yellow hover:bg-transparent ${
                  isPending || (timer > 0 && "text-black")
                }`}
              >
                {timer > 0 ? `resend otp in ${timer} seconds` : "resend otp"}
              </Button>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="flex-center button hover:bg-darkYellow col-span-2 mx-auto mt-2 w-full bg-yellow !text-lg !font-semibold"
            >
              Verify and Register {form.formState.isSubmitting && <Spinner />}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default VerifyOTP;
