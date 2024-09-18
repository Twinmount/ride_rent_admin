import { PrimaryFormType } from '@/types/formTypes'
import {
  BrandFormType,
  CategoryFormType,
  CityFormType,
  CompanyFormType,
  CompanyStatusFormType,
  StateFormType,
  VehicleTypeFormType,
} from '@/types/types'
import {
  CarFront,
  FileSearch,
  LayoutDashboard,
  Link,
  List,
  MapPin,
  Megaphone,
  Star,
  Tag,
  UserPlus,
} from 'lucide-react'

// sidebar content
export const sidebarContent = [
  { label: 'Dashboard', icon: LayoutDashboard, link: '/' },
  { label: 'Live Listings', icon: List, link: '/listings' },
  {
    label: 'Agents',
    icon: UserPlus,
    link: '/registrations',
  },
  {
    label: 'Categories & Types',
    icon: CarFront,
    link: '/vehicle',
  },
  { label: 'Brands', icon: Star, link: '/manage-brands' },
  { label: 'Locations', icon: MapPin, link: '/locations' },
  {
    label: 'Quick Links ',
    icon: Link,
    link: '/manage-links',
  },
  { label: 'Promotions', icon: Megaphone, link: '/manage-promotions' },
  { label: 'Meta Data', icon: FileSearch, link: '/meta-data' },
]

// sample vehicle categories
export const VehicleGeneralCategories = [
  {
    id: 1,
    label: 'Car',
    value: 'car',
  },
  {
    id: 2,
    label: 'Sports Car',
    value: 'sports_car',
  },
  {
    id: 3,
    label: 'Cycle',
    value: 'cycle',
  },
  {
    id: 4,
    label: 'Motorcycle',
    value: 'motorcycle',
  },
  {
    id: 5,
    label: 'Sports Bike',
    value: 'sports_bike',
  },
  {
    id: 6,
    label: 'Leisure Boat',
    value: 'leisure_boat',
  },
  {
    id: 7,
    label: 'Charter',
    value: 'charter',
  },
]

// Vehicle type form default values
export const VehicleTypeFormDefaultValues: VehicleTypeFormType = {
  name: '',
  value: '',
}

// Vehicle type form default values
export const BrandFormDefaultValues: BrandFormType = {
  metaTitle: '',
  metaDescription: '',
  brandName: '',
  brandValue: '',
  subHeading: '',
  vehicleCategoryId: '',
  brandLogo: '',
}

// State form default values
export const StateFormDefaultValues: StateFormType = {
  countryId: '',
  stateId: '',
  stateName: '',
  stateValue: '',
  subHeading: '',
  stateImage: '',
  metaTitle: '',
  metaDescription: '',
}
export const CityFormDefaultValues: CityFormType = {
  cityName: '',
  cityValue: '',
}

// Vehicle Category form default values
export const CategoryFormDefaultValues: CategoryFormType = {
  name: '',
  value: '',
}

// Link form default values
export const LinkFormDefaultValues = {
  label: '',
  link: 'https://ride.rent/',
}

// ads form default values
export const PromotionFormDefaultValue = {
  promotionImage: '',
  promotionLink: '',
}

export const HomeMetaFormDefaultValue = {
  stateId: '',
  metaTitle: '',
  metaDescription: '',
}

export const ListingMetaFormDefaultValue = {
  stateId: '',
  categoryId: '',
  typeId: '',
  metaTitle: '',
  metaDescription: '',
}

// navbar origin dropdown temporary value/s
export const orgs = [{ id: '1', label: 'UAE', value: 'uae' }]

// primary details form default values
export const PrimaryFormDefaultValues: PrimaryFormType = {
  vehicleCategoryId: '',
  vehicleTypeId: '', //'luxury' for example
  vehicleBrandId: '',
  vehicleModel: '',
  vehiclePhotos: [], //upto 8 photos of the vehicle
  vehicleRegistrationNumber: '',
  vehicleRegisteredYear: '',
  commercialLicenses: [],
  commercialLicenseExpireDate: new Date(),
  isLease: false,
  isCryptoAccepted: false,
  isSpotDeliverySupported: false,
  specification: 'UAE_SPEC',
  rentalDetails: {
    day: { enabled: false, rentInAED: '', mileageLimit: '' },
    week: { enabled: false, rentInAED: '', mileageLimit: '' },
    month: { enabled: false, rentInAED: '', mileageLimit: '' },
  },
  phoneNumber: '',
  stateId: '',
  cityIds: [],
  description: '',
}

// login page default value
export const LoginPageDefaultValues = {
  phoneNumber: '',
  password: '',
}

// Company registration phase 2 form default values
export const CompanyFormDefaultValues: CompanyFormType = {
  companyName: '',
  companyLogo: '',
  commercialLicense: '',
  expireDate: new Date(),
  regNumber: '',
}

// Company registration phase 2 form default values
export const CompanyStatusFormDefaultValues: CompanyStatusFormType = {
  approvalStatus: 'PENDING',
  rejectionReason: '',
}
