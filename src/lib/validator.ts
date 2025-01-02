import * as z from "zod";

// Vehicle Type Form Schema
export const VehicleTypeFormSchema = z.object({
  name: z
    .string()
    .min(3, "Vehicle Type title should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "Vehicle Type title should only contain letters and spaces"
    ),
  value: z
    .string()
    .min(3, "vehicle type value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "vehicle type value should only contain lowercase letters and hyphens"
    ),
});

// Brand Form Schema
export const BrandFormSchema = z.object({
  brandName: z
    .string()
    .min(3, "Brand title should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "Brand title should only contain letters and spaces"
    ),
  brandValue: z
    .string()
    .min(3, "Brand value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "Brand value should only contain lowercase letters and hyphens"
    ),
  brandLogo: z.string().min(1, "Brand logo is required"),
  vehicleCategoryId: z.string().min(1, "Category is required"),
});

// State Form Schema
export const StateFormSchema = z.object({
  stateName: z
    .string()
    .min(3, "State title should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "State title should only contain letters and spaces"
    ),
  stateValue: z
    .string()
    .min(3, "State value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "State value should only contain lowercase letters and hyphens"
    ),
  stateImage: z.string().min(1, "State image is required"),
});

// City Form Schema
export const CityFormSchema = z.object({
  cityName: z
    .string()
    .min(3, "City title should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "City title should only contain letters and spaces"
    ),
  cityValue: z
    .string()
    .min(3, "City value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "City value should only contain lowercase letters and hyphens"
    ),
});
// Category Form Schema
export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(3, "Category label should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "State title should only contain letters and spaces"
    ),
  value: z
    .string()
    .min(3, "Category value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "Category value should only contain lowercase letters and hyphens"
    ),
});

// Link Form Schema
export const LinkFormSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label should not exceed 100 characters"),
  link: z.string().min(1, "Link is required").url("Link must be a valid URL"),
});

// Recommended Link Form Schema
export const RecommendedLinkFormSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label should not exceed 100 characters"),
  link: z.string().min(1, "Link is required").url("Link must be a valid URL"),
});

// Ads Form Schema
export const PromotionFormSchema = z.object({
  promotionImage: z.string().min(1, "Promotion image is required"),
  promotionLink: z
    .string()
    .min(1, "Link is required")
    .url("Link must be a valid URL"),
});

// blog promotion form schema
export const BlogPromotionFormSchema = z.object({
  promotionImage: z.string().min(1, "Promotion image is required"),
  promotionLink: z
    .string()
    .min(1, "Link is required")
    .url("Link must be a valid URL"),
});

// RentalDetailType Schema for day, week, and month rentals )
const RentalDetailTypeSchema = z.object({
  enabled: z.boolean().optional().default(false),
  rentInAED: z.string().optional().default(""),
  mileageLimit: z.string().optional().default(""),
});

// HourlyRentalDetailType Schema with minBookingHours
const HourlyRentalDetailTypeSchema = z.object({
  enabled: z.boolean().optional().default(false),
  rentInAED: z.string().optional().default(""),
  mileageLimit: z.string().optional().default(""),
  minBookingHours: z.string().optional().default(""), // Only for hourly rentals
});

// Primary Form Zod Schema
export const PrimaryFormSchema = z
  .object({
    vehicleCategoryId: z.string().min(1, "Category is required"),
    vehicleTypeId: z.string().min(1, "Type is required"),
    vehicleBrandId: z.string().min(1, "Brand is required"),
    vehicleModel: z.string().min(1, "Model is required"),
    vehicleRegistrationNumber: z
      .string()
      .min(1, "Vehicle registration number is required")
      .max(15, "Vehicle registration number cannot exceed 15 characters"),
    vehicleRegisteredYear: z.string().min(1, "Registered Year is required"),
    vehiclePhotos: z
      .array(z.string().min(1, "vehicle photo is required"))
      .min(1, "At least one vehicle photo is required"),
    commercialLicenses: z.array(z.string().optional()),
    commercialLicenseExpireDate: z.date(),
    isLease: z.boolean().default(false),
    isCryptoAccepted: z.boolean().default(false),
    isSpotDeliverySupported: z.boolean().default(false),
    specification: z
      .enum(["USA_SPEC", "UAE_SPEC", "OTHERS"], {
        required_error: "Specification is required",
      })
      .default("UAE_SPEC"),
    rentalDetails: z.object({
      day: RentalDetailTypeSchema,
      week: RentalDetailTypeSchema,
      month: RentalDetailTypeSchema,
      hour: HourlyRentalDetailTypeSchema, // Uses schema with minBookingHours
    }),
    phoneNumber: z.string().min(6, "Provide a valid mobile number"),
    stateId: z.string().min(1, "State  is required"),
    cityIds: z
      .array(z.string().min(1, "City ID is required"))
      .min(1, "At least one city must be selected"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long")
      .max(5000, "Description cannot exceed 5000 characters"),
    vehicleTitle: z
      .string()
      .min(1, "Vehicle title is required")
      .max(150, "Vehicle title cannot exceed 150 characters"),
    additionalVehicleTypes: z.array(z.string()).optional(),
    securityDeposit: z.object({
      enabled: z.boolean().default(false),
      amountInAED: z.string().optional().default(""),
    }),
    isCreditOrDebitCardsSupported: z.boolean().default(false),
    isTabbySupported: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const categoriesExemptFromLicenses = [
        "0ad5ac71-5f8f-43c3-952f-a325e362ad87", // Bicycles
        "b21e0a75-37bc-430b-be3a-c8c0939ef3ec", // Buggies
      ];

      // If the category is Bicycles or Buggies, commercialLicenses can be skipped
      if (categoriesExemptFromLicenses.includes(data.vehicleCategoryId)) {
        return true;
      }

      // For other categories, ensure exactly 2 commercialLicenses are provided
      return data.commercialLicenses?.length === 2;
    },
    {
      message:
        "Commercial License is  required and must contain both front and back of the document",
      path: ["commercialLicenses"], // Attach error to the correct field
    }
  );

// login form schema
export const LoginFormSchema = z.object({
  phoneNumber: z.string().min(6, "Provide your registered phone number"),
  password: z.string().min(1, "Password is required"),
});

// otp form schema
export const OTPFormSchema = z.object({
  otp: z.string().min(4, "Enter a valid OTP"),
});

// Company Form Schema
export const CompanyFormSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(50, "Maximum 50 characters allowed"),
  companyLogo: z.string().min(1, "Company logo is required"),
  commercialLicense: z.string().min(1, "Commercial License is required"),
  expireDate: z.date(),
  regNumber: z.string().min(1, "Registration number is required"),
  companyAddress: z
    .string()
    .min(5, "Company address is required")
    .max(150, "Address can be up to 150 characters"),
  companyLanguages: z
    .array(z.string())
    .min(1, "At least one language must be selected"),
});

// Company Status Form Schema
export const CompanyStatusFormSchema = z
  .object({
    approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    rejectionReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.approvalStatus === "REJECTED") {
        return !!data.rejectionReason;
      }
      return true;
    },
    {
      message: "Rejection reason is required when the status is REJECTED",
      path: ["rejectionReason"], // Error message will be applied to the rejectionReason field
    }
  );

// Vehicle Status Form Schema
export const VehicleStatusFormSchema = z
  .object({
    approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED", "UNDER_REVIEW"]),
    rejectionReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.approvalStatus === "REJECTED") {
        return !!data.rejectionReason;
      }
      return true;
    },
    {
      message: "Rejection reason is required when the status is REJECTED",
      path: ["rejectionReason"], // Error message will be applied to the rejectionReason field
    }
  );

export const HomeMetaFormSchema = z.object({
  stateId: z.string().min(1, "State is required"),
  metaTitle: z
    .string()
    .min(1, "Meta title is required")
    .max(160, "Meta title must be 160 characters or less"),
  metaDescription: z
    .string()
    .min(1, "Meta description is required")
    .max(5000, "Meta description must be 5000 characters or less"),
});

export const ListingMetaFormSchema = z.object({
  stateId: z.string().min(1, "State is required"),
  categoryId: z.string().min(1, "Vehicle Category is required"),
  typeId: z.string().min(1, "Vehicle type is required"),
  metaTitle: z
    .string()
    .min(1, "Meta title is required")
    .max(160, "Meta title must be 160 characters or less"),
  metaDescription: z
    .string()
    .min(1, "Meta description is required")
    .max(5000, "Meta description must be 5000 characters or less"),
});

// blog form schema
export const BlogFormSchema = z.object({
  blogTitle: z
    .string()
    .min(3, "Blog title should be at least 3 characters long")
    .max(120, "Blog title should not exceed 120 characters"),

  blogDescription: z
    .string()
    .min(10, "Blog description should be at least 10 characters long")
    .max(150, "Blog description should not exceed 150 characters"),

  blogImage: z.string().min(1, "Blog image is required"),
  blogCategory: z
    .string()
    .min(3, "Blog category should be at least 3 characters long")
    .max(50, "Blog category should not exceed 50 characters"),

  authorName: z
    .string()
    .min(3, "Blog author should be at least 3 characters long")
    .max(30, "Blog title should not exceed 30 characters"),

  metaTitle: z
    .string()
    .min(3, "Meta title should be at least 3 characters long")
    .max(150, "Meta title should not exceed 150 characters"),

  metaDescription: z
    .string()
    .min(10, "Meta description should be at least 10 characters long")
    .max(500, "Meta description should not exceed 500 characters"),

  blogContent: z
    .string()
    .min(20, "Blog content should be at least 20 characters long") // Define minimal content for meaningful entries
    .max(5000, "Blog content should not exceed 5000 characters"),
});
