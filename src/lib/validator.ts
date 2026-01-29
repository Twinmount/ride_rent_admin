import * as z from "zod";

// Vehicle Type Form Schema
export const VehicleTypeFormSchema = z.object({
  name: z
    .string()
    .min(3, "Vehicle Type title should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "Vehicle Type title should only contain letters and spaces",
    ),
  value: z
    .string()
    .min(3, "vehicle type value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "vehicle type value should only contain lowercase letters and hyphens",
    ),
});

// Brand Form Schema
export const BrandFormSchema = z.object({
  brandName: z
    .string()
    .min(3, "Brand title should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "Brand title should only contain letters and spaces",
    ),
  brandValue: z
    .string()
    .min(3, "Brand value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "Brand value should only contain lowercase letters and hyphens",
    ),
  brandLogo: z.string().min(1, "Brand logo is required"),
  vehicleCategoryId: z.string().min(1, "Category is required"),
});

// Country Form Schema
export const CountryFormSchema = z.object({
  countryName: z
    .string()
    .min(3, "Country title should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "Country title should only contain letters and spaces",
    ),
  countryValue: z
    .string()
    .min(3, "Country value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "Country value should only contain lowercase letters and hyphens",
    ),
});

export const iconConfigSchema = z.object({
  iconName: z.string().optional(),
  bgColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
      message: "Invalid HEX color",
    })
    .optional(),
  strokeColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
      message: "Invalid HEX color",
    })
    .optional(),
  strokeWidth: z.string().optional(),
});

// State Form Schema
export const StateFormSchema = z.object({
  stateName: z
    .string()
    .min(3, "State title should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "State title should only contain letters and spaces",
    ),
  stateValue: z
    .string()
    .min(3, "State value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "State value should only contain lowercase letters and hyphens",
    ),
  stateImage: z.string().min(1, "State image is required"),
  stateIcon: z.string().optional(),
  isFavorite: z.boolean().optional(),
  relatedStates: z.array(z.string()).optional(),
  parentStateId: z.string().optional(),
  isParentState: z.boolean().optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string().optional(),
    })
    .refine((val) => val.lat && val.lng, {
      message: "Location is required",
    }),
  iconConfig: iconConfigSchema.optional(),
});

// City Form Schema
export const CityFormSchema = z.object({
  cityName: z
    .string()
    .min(3, "City title should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "City title should only contain letters and spaces",
    ),
  cityValue: z
    .string()
    .min(3, "City value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "City value should only contain lowercase letters and hyphens",
    ),
});
// Category Form Schema
export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(3, "Category label should be at least 3 characters long")
    .regex(
      /^[A-Za-z\s]+$/,
      "State title should only contain letters and spaces",
    ),
  value: z
    .string()
    .min(3, "Category value should be at least 3 characters long")
    .regex(
      /^[a-z-]+$/,
      "Category value should only contain lowercase letters and hyphens",
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
  blogPromotionPlacement: z.string().min(1, "Placement is required"),
});

// advisor blog promotion form schema
export const AdvisorPromotionFormSchema = z.object({
  promotionImage: z.string().min(1, "Promotion image is required"),
  promotionLink: z
    .string()
    .min(1, "Link is required")
    .url("Link must be a valid URL"),
});

// Base schema for day/week/month rentals
const RentalDetailTypeSchema = z.object({
  enabled: z.boolean().optional().default(false),
  rentInAED: z.string().optional().default(""),
  mileageLimit: z.string().optional().default(""),
  unlimitedMileage: z.boolean().optional().default(false),
});

// Extended schema for hourly rentals
const HourlyRentalDetailTypeSchema = RentalDetailTypeSchema.extend({
  minBookingHours: z.string().optional().default(""),
});

// Primary Form Zod Schema
export const PrimaryFormSchema = z
  .object({
    vehicleCategoryId: z.string().min(1, "Category is required"),
    vehicleTypeId: z.string().min(1, "Type is required"),
    vehicleBrandId: z.string().min(1, "Brand is required"),
    vehicleSeriesId: z.string().min(1, "Series is required"),
    vehicleModel: z.string().min(1, "Vehicle Model is required"),
    vehicleRegistrationNumber: z
      .string()
      .min(1, "Vehicle registration number is required")
      .max(15, "Vehicle registration number cannot exceed 15 characters"),
    isFancyNumber: z.boolean().default(false),
    vehicleRegisteredYear: z.string().min(1, "Year of Manufacture is required"),
    vehiclePhotos: z
      .array(z.string().min(1, "vehicle photo is required"))
      .min(1, "At least one vehicle photo is required"),
    thumbnail: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || val.trim().length > 0, {
        message: "Thumbnail path cannot be empty if provided",
      }),
    vehicleVideos: z.array(z.string().optional()),
    commercialLicenses: z.array(z.string().optional()),
    commercialLicenseExpireDate: z.date().optional(),
    isLease: z.boolean().default(false),
    isCryptoAccepted: z.boolean().default(false),
    isSpotDeliverySupported: z.boolean().default(false),
    specification: z
      .enum(["India_SPEC", "USA_SPEC", "UAE_SPEC", "OTHERS"], {
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
      .max(8000, "Description cannot exceed 5000 characters"), //additional 3000 is for to compensate for the text editor html tags strings.
    vehicleTitle: z
      .string()
      .min(1, "URL label is required")
      .max(50, "URL label cannot exceed 50 characters"),
    vehicleTitleH1: z
      .string()
      .min(1, "Vehicle title H1 is required")
      .max(100, "Vehicle title H1 cannot exceed 100 characters"),
    additionalVehicleTypes: z.array(z.string()).optional(),
    securityDeposit: z.object({
      enabled: z.boolean().default(false),
      amountInAED: z.string().optional().default(""),
    }),
    isCreditOrDebitCardsSupported: z.boolean().default(false),
    isTabbySupported: z.boolean().default(false),
    isCashSupported: z.boolean().default(false),
    isUPISupported: z.boolean().default(false),
    isVehicleModified: z.boolean().default(false),
    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
      })
      .refine((val) => val.lat && val.lng, {
        message: "Location is required",
      }),
    displayAddress: z
      .string()
      .min(5, "Display address is required")
      .max(150, "Display address can be up to 150 characters"),
    vehicleMetaTitle: z
      .string()
      .min(1, "Vehicle Meta title is required")
      .max(80, "Vehicle Meta title cannot exceed 80 characters"),
    vehicleMetaDescription: z
      .string()
      .min(1, "Vehicle Meta description is required")
      .max(5000, "Vehicle Meta description cannot exceed 5000 characters"),
    tempCitys: z
      .array(
        z.object({
          stateId: z.string(),
          cityId: z.string(),
          cityName: z.string(),
          cityValue: z.string(),
        }),
      )
      .optional(),
    disablePriceMatching: z.boolean().optional().default(false),
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
    },
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
export const CompanyFormSchema = (isIndia: boolean) =>
  z
    .object({
      companyName: z
        .string()
        .min(1, "Company name is required")
        .max(50, "Maximum 50 characters allowed"),
      companyLogo: z.string().min(1, "Company logo is required"),
      commercialLicense: z.string().min(1, "Commercial License is required"),
      expireDate: isIndia ? z.date().optional() : z.date(),
      noRegNumber: isIndia
        ? z.boolean().optional().default(false)
        : z.boolean().optional().default(false),
      regNumber: z.string().optional(),
      companyAddress: z
        .string()
        .min(5, "Company address is required")
        .max(150, "Address can be up to 150 characters"),
      displayAddress: z
        .string()
        .min(5, "Display address is required")
        .max(150, "Display address can be up to 150 characters"),
      companyLanguages: z
        .array(z.string())
        .min(1, "At least one language must be selected"),
      companyMetaTitle: z
        .string()
        .min(1, "Meta title is required")
        .max(80, "Meta title must be 80 characters or less"),
      companyMetaDescription: z
        .string()
        .min(1, "Meta description is required")
        .max(500, "Meta description must be 500 characters or less"),
      location: z
        .object({
          lat: z.number(),
          lng: z.number(),
          address: z.string(),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      const noReg = (data as any).noRegNumber;
      const reg = (data as any).regNumber;
      if (!noReg) {
        // regNumber is required when noRegNumber is false
        if (!reg || (typeof reg === "string" && reg.trim().length === 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${isIndia ? "GST" : "Registration"} number is required`,
            path: ["regNumber"],
          });
        } else if (isIndia) {
          // if India, validate GST format
          const gstRegex =
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;
          if (!gstRegex.test(reg)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Invalid GST number format",
              path: ["regNumber"],
            });
          }
        }
      }
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
    },
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
    },
  );

export const HomeMetaFormSchema = z.object({
  stateId: z.string().min(1, "State is required"),
  categoryId: z.string().min(1, "Vehicle Category is required"),
  metaTitle: z
    .string()
    .min(1, "Meta title is required")
    .max(160, "Meta title must be 160 characters or less"),
  metaDescription: z
    .string()
    .min(1, "Meta description is required")
    .max(5000, "Meta description must be 5000 characters or less"),
});

export const ListingMetaFormSchema = z
  .object({
    stateId: z.string().optional(),
    categoryId: z.string().min(1, "Vehicle Category is required"),
    typeId: z.string().optional(),
    brandId: z.string().optional(),
    metaTitle: z
      .string()
      .min(1, "Meta title is required")
      .max(160, "Meta title must be 160 characters or less"),
    metaDescription: z
      .string()
      .min(1, "Meta description is required")
      .max(5000, "Meta description must be 5000 characters or less"),
    h1: z.string().max(60, "H1 can be maximum 60 characters long"),
    h2: z.string().max(160, "H2 can be maximum 160 characters long"),
  })
  .refine(
    (data) => {
      if (!data.brandId && !data.stateId) {
        return false;
      }
      return true;
    },
    {
      message: "State is required for non-brand metadata",
      path: ["stateId"],
    },
  );

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
    .min(20, "Blog content should be at least 20 characters long"),
});

// advisor blog form schema
export const AdvisorBlogFormSchema = z.object({
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
    .min(20, "Blog content should be at least 20 characters long"),
});

export const VehicleSeriesSchema = z.object({
  state: z.string().min(1, "State  is required"),
  vehicleCategoryId: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),
  vehicleSeriesLabel: z
    .string()
    .min(1, "Series is required")
    .regex(
      /^[a-zA-Z0-9\s-]+$/,
      "Series must only contain alphanumeric characters, hyphens, and spaces",
    ),
  vehicleSeries: z
    .string()
    .min(1, "Series is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Series value must be lowercase, hyphen-separated, and alphanumeric",
    ),
  vehicleSeriesPageHeading: z
    .string()
    .min(1, "Page heading is required")
    .max(100, "Page heading cannot exceed 100 characters"),
  vehicleSeriesPageSubheading: z
    .string()
    .min(1, "Page subheading is required")
    .max(200, "Page subheading cannot exceed 200 characters"),
  vehicleSeriesInfoTitle: z
    .string()
    .min(1, "Series Info title is required")
    .max(80, "Series Info title cannot exceed 80 characters"),
  vehicleSeriesInfoDescription: z
    .string()
    .min(1, "Series Info description is required")
    .max(300, "Series Info description cannot exceed 300 characters"),
  vehicleSeriesMetaTitle: z
    .string()
    .min(1, "Series Meta title is required")
    .max(80, "Series Meta title cannot exceed 80 characters"),
  vehicleSeriesMetaDescription: z
    .string()
    .min(1, "Series Meta description is required")
    .max(5000, "Series Meta description cannot exceed 5000 characters"),
  seriesBodyContent: z.string().optional(),
});

export const VehicleBucketSchema = z
  .object({
    vehicleBucketMode: z.enum(
      ["VEHICLE_CODE", "VEHICLE_TYPE", "LOCATION_COORDINATES"],
      {
        required_error: "Bucket mode is required",
      },
    ),

    // Always required fields
    stateId: z.string().min(1, "State is required"),
    displayGroup: z.enum(["POPULAR_RENTAL_SEARCHES", "POPULAR_VEHICLE_PAGES"], {
      required_error: "Section type is required",
    }),
    linkText: z
      .string()
      .min(1, "Link text is required")
      .max(100, "Link text cannot exceed 100 characters"),
    vehicleBucketName: z
      .string()
      .min(1, "Vehicle bucket name is required")
      .max(100, "Vehicle bucket name is too long"),
    vehicleBucketValue: z
      .string()
      .min(1, "Vehicle bucket value (slug) is required")
      .max(100, "Vehicle bucket value is too long")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must only contain lowercase letters, numbers, and hyphens",
      ),
    vehicleBucketDescription: z
      .string()
      .min(1, "Bucket description is required")
      .max(300, "Bucket description cannot exceed 300 characters"),
    pageHeading: z
      .string()
      .min(1, "Page heading is required")
      .max(100, "Page heading cannot exceed 100 characters"),
    pageSubheading: z
      .string()
      .min(1, "Page subheading is required")
      .max(200, "Page subheading cannot exceed 200 characters"),
    metaTitle: z
      .string()
      .min(1, "Meta title is required")
      .max(80, "Meta title cannot exceed 80 characters"),
    metaDescription: z
      .string()
      .min(1, "Meta description is required")
      .max(5000, "Meta description cannot exceed 5000 characters"),

    // Conditional fields (optional in schema, validated in refinement)
    vehicleCodes: z.array(z.string()).optional(),
    vehicleCategoryId: z.string().optional(),
    vehicleTypeId: z.string().optional(),
    location: z.preprocess(
      (value) => (value === null ? undefined : value),
      z
        .object({
          lat: z.number(),
          lng: z.number(),
          address: z.string().optional(),
        })
        .optional(),
    ),
  })
  .refine(
    (data) => {
      // VEHICLE_CODE mode: vehicleCodes is required
      if (data.vehicleBucketMode === "VEHICLE_CODE") {
        return (
          Array.isArray(data.vehicleCodes) &&
          data.vehicleCodes.length >= 1 &&
          data.vehicleCodes.length <= 20
        );
      }
      return true;
    },
    {
      message: "Vehicle codes: Select between 1 and 20 vehicles",
      path: ["vehicleCodes"],
    },
  )
  .refine(
    (data) => {
      // VEHICLE_TYPE mode: vehicleTypeId is required
      if (data.vehicleBucketMode === "VEHICLE_TYPE") {
        return !!data.vehicleTypeId && data.vehicleTypeId.trim() !== "";
      }
      return true;
    },
    {
      message: "Vehicle type is required for this mode",
      path: ["vehicleTypeId"],
    },
  )
  .refine(
    (data) => {
      // LOCATION_COORDINATES mode: location is required
      if (data.vehicleBucketMode === "LOCATION_COORDINATES") {
        return (
          !!data.location &&
          typeof data.location.lat === "number" &&
          typeof data.location.lng === "number"
        );
      }
      return true;
    },
    {
      message: "Location coordinates are required for this mode",
      path: ["location"],
    },
  );

export const locationOptions = [
  "Remote",
  "Onsite",
  "Hybrid",
  "Freelance",
  "Contract",
  "Internship",
  "Part-time",
  "Full-time",
  "Temporary",
  "Project-based",
] as const;

export const levelOptions = [
  "Intern / Trainee",
  "Entry-Level / Junior",
  "Associate / Mid-Level",
  "Senior-Level",
  "Lead / Principal",
  "Manager / Team Lead",
  "Director",
  "VP / Vice President",
  "C-Level (e.g., CTO, CFO, CEO)",
] as const;

export const experienceOptions = [
  "1-2 yrs",
  "2-3 yrs",
  "3-4 yrs",
  "4-5 yrs",
  "5-6 yrs",
  "6-7 yrs",
  "7-8 yrs",
  "8-9 yrs",
  "9-10 yrs",
  "10-11 yrs",
  "11-12 yrs",
  "12-13 yrs",
  "13-14 yrs",
  "14-15 yrs",
  "15-16 yrs",
] as const;

export const countryOptions = ["UAE", "INDIA"] as const;

export const JobFormSchema = z.object({
  jobtitle: z
    .string()
    .min(3, "Job title should be at least 3 characters long")
    .max(120, "Job title should not exceed 120 characters"),

  jobdescription: z
    .string()
    .min(10, "Job description should be at least 10 characters long")
    .max(500, "Job description should not exceed 500 characters"),

  aboutCompany: z
    .string()
    .min(10, "About company should be at least 10 characters long")
    .max(500, "About company should not exceed 500 characters")
    .optional(),

  date: z.string().min(1, "Date is required"),

  location: z.string().refine((val) => locationOptions.includes(val as any), {
    message: "Please select a valid job location.",
  }),

  level: z.string().refine((val) => levelOptions.includes(val as any), {
    message: "Please select a valid job level.",
  }),

  experience: z
    .string()
    .refine((val) => experienceOptions.includes(val as any), {
      message: "Please select a valid experience range.",
    }),

  country: z.string().refine((val) => countryOptions.includes(val as any), {
    message: "Please select a valid country.",
  }),

  sections: z
    .array(
      z.object({
        title: z.string(),
        points: z.array(z.string()),
      }),
    )
    .optional(),
});

// SRM : Customer Details Form Schema
export const SRMCustomerDetailsFormSchema = z.object({
  customerProfilePic: z.string().optional(),
  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(50, "Maximum 50 characters allowed"),
  email: z.string().email("Provide a valid email address"),
  nationality: z
    .string()
    .min(1, "Nationality is required")
    .max(30, "Maximum 30 characters allowed"),
  passportNumber: z
    .string()
    .min(1, "Passport number is required")
    .max(30, "Maximum 30 characters allowed"),
  passport: z
    .array(z.string().min(1, "Passport image is required"))
    .min(2, "Upload both front and back of the passport"),
  drivingLicenseNumber: z
    .string()
    .min(1, "Driving license number is required")
    .max(30, "Maximum 30 characters allowed"),
  drivingLicense: z
    .array(z.string().min(1, "Driving license image is required"))
    .min(2, "Upload both front and back of the driving license"),
  phoneNumber: z.string().min(6, "Provide a valid mobile number"),
});

/**
 * Schema for a single ride promotion card (vehicle)
 */
export const RidePromotionCardSchema = z.object({
  image: z.string().min(1, "Image is required"),
  cardTitle: z.string().min(1, "Title is required"),
  cardSubtitle: z.string().min(1, "Subtitle is required"),
  link: z.string().url("Must be a valid URL"),
});

/**
 * Schema for the entire promotion section
 */
export const RidePromotionFormSchema = z.object({
  sectionTitle: z.string().min(1, "Section title is required"),
  sectionSubtitle: z.string().min(1, "Section subtitle is required"),
  cards: z
    .array(RidePromotionCardSchema)
    .max(4, "You can only add up to 4 promotion cards")
    .min(1, "At least 1 promotion card is required"),
});
