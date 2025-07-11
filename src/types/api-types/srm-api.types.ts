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
