import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LoginFormSchema } from '@/lib/validator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import Spinner from '@/components/general/Spinner'
import { toast } from '@/components/ui/use-toast'
import { register } from '@/api/auth'

const Register = () => {
  const navigate = useNavigate()

  // Retrieve stored values from sessionStorage
  const storedPhoneNumber = sessionStorage.getItem('phoneNumber') || ''
  const storedCountryCode = sessionStorage.getItem('countryCode') || ''
  const storedPassword = sessionStorage.getItem('password') || ''

  const [countryCode, setCountryCode] = useState(storedCountryCode)

  const initialValues = {
    phoneNumber: storedCountryCode + storedPhoneNumber,
    password: storedPassword,
  }

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    // if (!isPhoneValid(values.phoneNumber)) {
    //   form.setError('phoneNumber', {
    //     type: 'manual',
    //     message: 'Provide valid phone number',
    //   })
    //   return
    // }
    try {
      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, '')
        .trim()

      const data = await register(values, countryCode)

      if (data) {
        sessionStorage.setItem('otpId', data?.result.otpId)
        sessionStorage.setItem('userId', data?.result.userId)

        // Store phoneNumber, countryCode, and password separately in sessionStorage
        sessionStorage.setItem('phoneNumber', phoneNumber)
        sessionStorage.setItem('countryCode', countryCode)
        sessionStorage.setItem('password', values.password)

        navigate('/verify-otp')
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error.message

        if (typeof errorMessage === 'string') {
          form.setError('phoneNumber', {
            type: 'manual',
            message: 'mobile already registered',
          })
        } else if (errorMessage[0]?.constraints?.IsCustomPhoneNumber) {
          form.setError('phoneNumber', {
            type: 'manual',
            message: 'mobile number is invalid',
          })
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: 'Something went wrong. ',
        })
      }
    }
  }

  return (
    <section className="h-screen bg-gray-100 flex-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 bg-white shadow-lg p-4 pb-6 rounded-[1rem] w-full max-w-[500px] mx-auto"
        >
          <h3 className="mb-4 text-3xl font-bold text-center text-yellow">
            Admin Register
          </h3>
          <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
            {/* mobile / whatsapp*/}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full mb-2">
                  <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                    Mobile
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <PhoneInput
                        defaultCountry="ae"
                        value={field.value}
                        onChange={(value, country) => {
                          field.onChange(value)
                          setCountryCode(country.country.dialCode)
                        }}
                        className="flex items-center"
                        inputClassName="input-field !w-full !text-base"
                        placeholder="whatsapp number"
                        countrySelectorStyleProps={{
                          className:
                            'bg-white !border-none outline-none !rounded-xl  mr-1 !text-lg',
                          style: {
                            border: 'none ',
                          },
                          buttonClassName:
                            '!border-none outline-none !h-[52px] !w-[50px] !rounded-xl bg-gray-100',
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
                <FormItem className="flex flex-col w-full mb-2 ">
                  <FormLabel className="flex justify-between ml-2 text-base w-72 lg:text-lg">
                    Password
                  </FormLabel>
                  <div className="flex-col items-start w-full">
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
              className="w-full  mx-auto flex-center col-span-2 mt-2 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
            >
              Send OTP {form.formState.isSubmitting && <Spinner />}
            </Button>
          </div>
          <div className="px-2 mt-3 flex-between">
            <Link to={'/forgot-password'} className="text-yellow">
              Forgot Password ?
            </Link>
            <div>
              New to Ride.Rent?{' '}
              <Link to={'/login'} className="font-semibold text-yellow">
                Login
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default Register
