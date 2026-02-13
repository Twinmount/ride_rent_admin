import { RentalDetailsFormFieldType } from "../formTypes";

export interface SRMActiveTripType {
  tripId: string;
  agentName: string;
  customerName: string;
  countryCode: string;
  phoneNumber: string;
  nationality: string;
  vehicleId: string;
  vehicleName: string;
  bookingStartDate: string;
}

export interface FetchAllSRMActiveTripsResponse {
  result: {
    list: SRMActiveTripType[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface SRMCompletedTripType {
  tripId: string;
  agentName: string;
  customerName: string;
  countryCode: string;
  phoneNumber: string;
  nationality: string;
  vehicleId: string;
  vehicleName: string;
  bookingStartDate: string;
  bookingEndDate: string;
  totalAmountCollected: string;
}

export interface FetchAllSRMCompletedTripsResponse {
  result: {
    list: SRMCompletedTripType[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface SRMAgentType {
  agentName: string;
  location: string;
  firstTripActivatedDate: string;
  expiryDate: string;
  planDetails: string;
}

export interface FetchAllSRMAgentsResponse {
  result: {
    list: SRMAgentType[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface SRMCustomerType {
  customerId: string;
  customerName: string;
  nationality: string;
  passportNumber: string;
  drivingLicenseNumber: string;
  countryCode: string;
  phoneNumber: string;
}

export interface FetchAllSRMCustomersResponse {
  result: {
    list: SRMCustomerType[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface CustomerApiType {
  id: string; // Unique identifier for the user
  customerId: string;
  customerName: string; // User's name
  email: string;
  nationality: string; // User's nationality
  passportNumber: string; // User's passport number
  passport: string[];
  drivingLicenseNumber: string; // User's driving license number
  drivingLicense: string[];
  phoneNumber: string; // User's phone number, possibly formatted
  customerProfilePic?: string; // Optional field for the user's profile image or identifier
  customerProfilePicPath?: string; // Optional field for the user's profile image or identifier
  countryCode: string; // The country code associated with the user's phone number
}

export interface AddSRMCustomerFormResponse {
  result: CustomerApiType;
  status: string;
  statusCode: number;
}

export interface GetSRMCustomerDetailsResponse {
  result: CustomerApiType;
  status: string;
  statusCode: number;
}

export interface SRMVehicleType {
  vehicleId: string;
  agentName: string;
  brandName: string;
  vehicleCategory: string;
  vehiclePhoto: string;
  vehicleRegistrationNumber: string;
  rentalDetails: RentalDetailsFormFieldType;
}

export interface FetchAllSRMVehiclesResponse {
  result: {
    list: SRMVehicleType[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface BookingDetailsType {
  bookingId: string;
  userId: string;
  vehicleId: string;
  status: "CONFIRMED" | "CANCELLED" | "PENDING" | "COMPLETED";
  startDate: string;
  endDate: string;
  customerEmail: string;
  customerName: string;
  customerMobile: string;
  vehicleUrl: string;
  rentalType: "daily" | "weekly" | "monthly" | "hourly";
  rentalUnits: number;
  vehicleCode: string;
  vehicleTitle: string;
  coupon: {
    code: string;
    discountAmount: number;
    isConsumed: boolean;
  };
  payment: {
    provider: string;
    status: "SUCCESS" | "FAILED" | "PENDING";
    amount: number;
    currency: string;
    paymentIntentId: string;
    totalAmount: number;
    reservationFees: number;
    payOnPickup: number;
    discountAmount: number;
  };
  pickupLocation: string;
  dropLocation: string;
  createdAt: string;
  updatedAt: string;
  vehicleDetails: {
    vehicleCode: string;
    brand: {
      label: string;
      value: string;
    };
    state: {
      id: string;
      label: string;
      value: string;
    };
    photos: string[];
    rentalDetails: {
      day: {
        enabled: boolean;
        rentInAED: string;
        mileageLimit: string;
        unlimitedMileage: boolean;
      };
      week: {
        enabled: boolean;
        rentInAED: string;
        mileageLimit: string;
        unlimitedMileage: boolean;
      };
      month: {
        enabled: boolean;
        rentInAED: string;
        mileageLimit: string;
        unlimitedMileage: boolean;
      };
      hour: {
        enabled: boolean;
        rentInAED: string;
        mileageLimit: string;
        unlimitedMileage: boolean;
        minBookingHours: string;
      };
    };
    company: {
      companyId: string;
      companyProfile: string;
      companyName: string;
      companySpecs: {
        isCryptoAccepted: boolean;
        isSpotDeliverySupported: boolean;
        isTabbySupported: boolean;
        isCreditOrDebitCardsSupported: boolean;
        isCashSupported: boolean;
        isUPISupported: boolean;
      };
      contactDetails: {
        email: string;
        phone: string;
        countryCode: string;
        whatsappPhone: string;
        whatsappCountryCode: string;
      };
      companyLanguages: string[];
    };
    description: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
  };
}

export interface FetchAllBookingsResponse {
  status: string;
  result: {
    status: string;
    result: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      list: BookingDetailsType[];
    };
  };
  statusCode: number;
}