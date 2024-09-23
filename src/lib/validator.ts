import * as z from 'zod'

// Vehicle Type Form Schema
export const VehicleTypeFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Vehicle Type title should be at least 3 characters long')
    .regex(
      /^[A-Za-z\s]+$/,
      'Vehicle Type title should only contain letters and spaces'
    ),
  value: z
    .string()
    .min(3, 'vehicle type value should be at least 3 characters long')
    .regex(
      /^[a-z-]+$/,
      'vehicle type value should only contain lowercase letters and hyphens'
    ),
})

// Brand Form Schema
export const BrandFormSchema = z.object({
  brandName: z
    .string()
    .min(3, 'Brand title should be at least 3 characters long')
    .regex(
      /^[A-Za-z\s]+$/,
      'Brand title should only contain letters and spaces'
    ),
  brandValue: z
    .string()
    .min(3, 'Brand value should be at least 3 characters long')
    .regex(
      /^[a-z-]+$/,
      'Brand value should only contain lowercase letters and hyphens'
    ),
  subHeading: z.string().min(1, 'Title subheading required'),
  vehicleCategoryId: z.string().min(1, 'Category is required'),
  brandLogo: z
    .union([
      z.instanceof(File), // For when a file is selected
      z.string(), // For when a URL from backend is used
    ])
    .refine((value) => {
      // Ensure value is either a File or a non-empty string (URL)
      if (value instanceof File) {
        return true
      } else if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return false
    }, 'Logo must be either a valid File or a non-empty URL'),
  metaTitle: z.string().min(1, 'Meta title is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
})

// State Form Schema
export const StateFormSchema = z.object({
  stateName: z
    .string()
    .min(3, 'State title should be at least 3 characters long')
    .regex(
      /^[A-Za-z\s]+$/,
      'State title should only contain letters and spaces'
    ),
  stateValue: z
    .string()
    .min(3, 'State value should be at least 3 characters long')
    .regex(
      /^[a-z-]+$/,
      'State value should only contain lowercase letters and hyphens'
    ),

  subHeading: z.string().min(1, 'State page subheading required'),
  // Define logo as a union type of File and string
  stateImage: z
    .union([
      z.instanceof(File), // For when a file is selected
      z.string(), // For when a URL from backend is used
    ])
    .refine((value) => {
      // Ensure value is either a File or a non-empty string (URL)
      if (value instanceof File) {
        return true
      } else if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return false
    }, 'Logo must be either a valid File or a non-empty URL'),
  metaTitle: z.string().min(1, 'Meta title is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
})

// City Form Schema
export const CityFormSchema = z.object({
  cityName: z
    .string()
    .min(3, 'City title should be at least 3 characters long')
    .regex(
      /^[A-Za-z\s]+$/,
      'City title should only contain letters and spaces'
    ),
  cityValue: z
    .string()
    .min(3, 'City value should be at least 3 characters long')
    .regex(
      /^[a-z-]+$/,
      'City value should only contain lowercase letters and hyphens'
    ),
})
// Category Form Schema
export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Category label should be at least 3 characters long')
    .regex(
      /^[A-Za-z\s]+$/,
      'State title should only contain letters and spaces'
    ),
  value: z
    .string()
    .min(3, 'Category value should be at least 3 characters long')
    .regex(
      /^[a-z-]+$/,
      'Category value should only contain lowercase letters and hyphens'
    ),
})

// Link Form Schema
export const LinkFormSchema = z.object({
  label: z
    .string()
    .min(1, 'Label is required')
    .max(100, 'Label should not exceed 100 characters'),
  link: z.string().min(1, 'Link is required').url('Link must be a valid URL'),
})

// Ads Form Schema
export const PromotionFormSchema = z.object({
  promotionImage: z
    .union([
      z.instanceof(File), // For when a file is selected
      z.string(), // For when a URL from backend is used
    ])
    .refine((value) => {
      // Ensure value is either a File or a non-empty string (URL)
      if (value instanceof File) {
        return true
      } else if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return false
    }, 'Image must be either a valid File or a non-empty URL'),
  promotionLink: z
    .string()
    .min(1, 'Link is required')
    .url('Link must be a valid URL'),
})

// RentalDetailType Schema
const RentalDetailTypeSchema = z.object({
  enabled: z.boolean().optional(),
  rentInAED: z.string().optional(),
  mileageLimit: z.string().optional(),
})

// Primary Form Schema
export const PrimaryFormSchema = z.object({
  vehicleCategoryId: z.string().min(1, 'Category is required'),
  vehicleTypeId: z.string().min(1, 'Type is required'),
  vehicleBrandId: z.string().min(1, 'Brand is required'),
  vehicleModel: z.string().min(1, 'Model is required'),
  vehicleRegistrationNumber: z
    .string()
    .min(1, 'Vehicle registration number is required')
    .max(15, 'Vehicle registration number cannot exceed 15 characters'),
  vehicleRegisteredYear: z.string().min(1, 'Registered Year is required'),
  vehiclePhotos: z
    .array(
      z.union([
        z.instanceof(File), // For newly uploaded files
        z.string().url('Photo must be a valid URL'), // For existing URLs
      ])
    )
    .max(8, 'You can upload up to 8 photos only')
    .min(1, 'At least one photo is required')
    .refine(
      (arr) =>
        arr.every((item) => item instanceof File || typeof item === 'string'),
      'Each photo must be either a file or a URL'
    ),
  commercialLicenses: z
    .array(
      z.union([
        z.instanceof(File), // For newly uploaded files
        z.string().url('Commercial License (Mulkia) card must be a valid URL'), // For existing URLs
      ])
    )
    .length(2, 'Mulkia/ Registration card (front and back) images are required')
    .refine(
      (arr) =>
        arr.every((item) => item instanceof File || typeof item === 'string'),
      'Commercial License (Mulkia) must be either a file or a URL'
    ),
  commercialLicenseExpireDate: z.date(),
  isLease: z.boolean().default(false),
  isCryptoAccepted: z.boolean().default(false),
  isSpotDeliverySupported: z.boolean().default(false),
  specification: z
    .enum(['USA_SPEC', 'UAE_SPEC', 'OTHERS'], {
      required_error: 'Specification is required',
    })
    .default('UAE_SPEC'),
  rentalDetails: z.object({
    day: RentalDetailTypeSchema,
    week: RentalDetailTypeSchema,
    month: RentalDetailTypeSchema,
  }),
  phoneNumber: z.string().min(6, 'Provide a valid mobile number'),
  stateId: z.string().min(1, 'State  is required'),
  cityIds: z
    .array(z.string().min(1, 'City ID is required'))
    .min(1, 'At least one city must be selected'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(5000, 'Description cannot exceed 5000 characters'),
})

// login form schema
export const LoginFormSchema = z.object({
  phoneNumber: z.string().min(6, 'Provide your registered phone number'),
  password: z.string().min(1, 'Password is required'),
})

// otp form schema
export const OTPFormSchema = z.object({
  otp: z.string().min(4, 'Enter a valid OTP'),
})

// Company Form Schema
export const CompanyFormSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(50, 'Maximum 50 characters allowed'),
  companyLogo: z
    .union([
      z.instanceof(File), // For when a file is selected
      z.string(), // For when a URL from backend is used
    ])
    .refine((value) => {
      // Ensure value is either a File or a non-empty string (URL)
      if (value instanceof File) {
        return true
      } else if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return false
    }, 'Logo must be either a valid File or a non-empty URL'),
  commercialLicense: z
    .union([
      z.instanceof(File), // For when a file is selected
      z.string(), // For when a URL from backend is used
    ])
    .refine((value) => {
      // Ensure value is either a File or a non-empty string (URL)
      if (value instanceof File) {
        return true
      } else if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return false
    }, 'Logo must be either a valid File or a non-empty URL'),
  expireDate: z.date(),
  regNumber: z.string().min(1, 'Registration number is required'),
})

// Company Status Form Schema
export const CompanyStatusFormSchema = z
  .object({
    approvalStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
    rejectionReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.approvalStatus === 'REJECTED') {
        return !!data.rejectionReason
      }
      return true
    },
    {
      message: 'Rejection reason is required when the status is REJECTED',
      path: ['rejectionReason'], // Error message will be applied to the rejectionReason field
    }
  )

// Vehicle Status Form Schema
export const VehicleStatusFormSchema = z
  .object({
    approvalStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW']),
    rejectionReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.approvalStatus === 'REJECTED') {
        return !!data.rejectionReason
      }
      return true
    },
    {
      message: 'Rejection reason is required when the status is REJECTED',
      path: ['rejectionReason'], // Error message will be applied to the rejectionReason field
    }
  )

export const HomeMetaFormSchema = z.object({
  stateId: z.string().min(1, 'State is required'),
  metaTitle: z
    .string()
    .min(1, 'Meta title is required')
    .max(160, 'Meta title must be 160 characters or less'),
  metaDescription: z
    .string()
    .min(1, 'Meta description is required')
    .max(5000, 'Meta description must be 5000 characters or less'),
})

export const ListingMetaFormSchema = z.object({
  stateId: z.string().min(1, 'State is required'),
  categoryId: z.string().min(1, 'Vehicle Category is required'),
  typeId: z.string().min(1, 'Vehicle type is required'),
  metaTitle: z
    .string()
    .min(1, 'Meta title is required')
    .max(160, 'Meta title must be 160 characters or less'),
  metaDescription: z
    .string()
    .min(1, 'Meta description is required')
    .max(5000, 'Meta description must be 5000 characters or less'),
})
