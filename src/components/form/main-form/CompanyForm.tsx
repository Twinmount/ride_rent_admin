import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import 'react-datepicker/dist/react-datepicker.css'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CompanyFormDefaultValues } from '@/constants'
import { CompanyFormSchema } from '@/lib/validator'
import { Pen, ShieldCheck, Copy } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import SingleFileUpload from '../SingleFileUpload'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
import { updateCompany } from '@/api/company'
import Spinner from '@/components/general/Spinner'
import { useState } from 'react'
import { CompanyType } from '@/types/api-types/vehicleAPI-types'

type CompanyFormProps = {
  type: 'Update'
  formData?: CompanyType | null
}

export default function CompanyForm({ type, formData }: CompanyFormProps) {
  const navigate = useNavigate()
  const { companyId } = useParams<{ companyId: string }>()
  const [isEditing, setIsEditing] = useState(false)

  const initialValues =
    formData && type === 'Update'
      ? {
          ...formData,
          expireDate: formData.expireDate
            ? new Date(formData.expireDate)
            : undefined,
        }
      : CompanyFormDefaultValues

  // creating form
  const form = useForm<z.infer<typeof CompanyFormSchema>>({
    resolver: zodResolver(CompanyFormSchema),
    defaultValues: initialValues,
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    form.reset(initialValues)
  }

  async function onSubmit(values: z.infer<typeof CompanyFormSchema>) {
    console.log('company form values', values)

    try {
      const data = await updateCompany(values, companyId as string)

      if (data) {
        toast({
          title: `Company ${type}ed successfully`,
          className: 'bg-yellow text-white',
        })
        navigate('/registrations')
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: `${type} Company failed`,
        description: 'Something went wrong',
      })
    } finally {
      setIsEditing(false)
    }
  }

  const handleCopyAgentId = () => {
    navigator.clipboard.writeText(initialValues.agentId || '')
    toast({
      title: 'Copied to clipboard',
      description: 'Agent ID has been copied to your clipboard.',
      className: 'bg-green-500 text-white',
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-[800px] mx-auto  bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8 border-t shadow-md"
      >
        <div className="flex flex-col w-full gap-5 p-3 mx-auto rounded-3xl">
          {/* agent id */}
          <div className="flex w-full mb-2 max-sm:flex-col">
            <div className="flex justify-between mt-4 ml-2 text-base font-semibold max-sm:w-fit w-72 lg:text-lg">
              Your Agent Id <span className="mr-5 max-sm:hidden">:</span>
            </div>
            <div className="flex items-center w-full mt-4 text-lg font-semibold text-gray-500 cursor-default">
              {initialValues.agentId}{' '}
              <ShieldCheck className="ml-3 text-green-500" size={20} />
              <Button
                type="button"
                onClick={handleCopyAgentId} // Call the copy handler
                className="p-1 ml-8 text-gray-500 h-fit bg-slate-600 hover:bg-slate-900 hover:shadow-md"
              >
                <Copy className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>

          {/* company name */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base max-sm:w-fit w-72 lg:text-lg">
                  Company Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="Company Name"
                      {...field}
                      className="input-field"
                      readOnly={!isEditing}
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
                    Enter your company name.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* company logo */}
          <FormField
            control={form.control}
            name="companyLogo"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="Company Logo"
                description="Company logo can have a maximum size of 5MB."
                existingFile={formData?.companyLogo}
                maxSizeMB={5}
                isDisabled={!isEditing}
              />
            )}
          />

          {/* trade license */}
          <FormField
            control={form.control}
            name="commercialLicense"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="Commercial License"
                description="Commercial License can have a maximum size of 5MB."
                existingFile={formData?.commercialLicense}
                maxSizeMB={5}
                isDisabled={!isEditing}
              />
            )}
          />

          {/* expiry date */}
          <FormField
            control={form.control}
            name="expireDate"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-52 max-sm:w-fit lg:text-lg">
                  Expiry Date <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-fit">
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="MM/dd/yyyy"
                      wrapperClassName="datePicker text-base -ml-4 "
                      readOnly={!isEditing}
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
                    Enter the expiry of your Commercial License/Trade License.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* registration number */}
          <FormField
            control={form.control}
            name="regNumber"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base max-sm:w-fit w-72 lg:text-lg">
                  Registration Number{' '}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="eg: ABC12345"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
                    Enter your company registration number (e.g., ABC12345). The
                    number should be a combination of letters and numbers,
                    without any spaces or special characters, up to 15
                    characters.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* submit */}
        {isEditing ? (
          <div className="w-full h-12 gap-3 flex-center">
            <Button
              variant="outline"
              className="w-full h-full text-lg font-semibold text-white bg-red-500 hover:bg-red-500 hover:text-white hover:shadow-lg"
              disabled={form.formState.isSubmitting}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="w-full h-full text-lg font-semibold text-white flex-center bg-yellow hover:bg-yellow hover:text-white hover:shadow-lg"
            >
              Update
              {form.formState.isSubmitting && <Spinner />}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="h-12 gap-2 text-lg font-semibold text-white bg-yellow hover:bg-yellow hover:text-white hover:shadow-lg rounded-xl flex-center"
            onClick={handleEdit}
          >
            Edit <Pen />
          </Button>
        )}
      </form>
    </Form>
  )
}
