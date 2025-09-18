import {
  LayoutDashboard,
  List,
  UserPlus,
  CarFront,
  Star,
  MapPin,
  Megaphone,
  FileText,
  FileSearch,
  Group,
  GraduationCap,
  Box,
  CloudDownload,
} from "lucide-react";

// Define the type for the items in the "accordion"
export type SidebarSubItemType = {
  label: string;
  link: string;
};

// Define the base type for common properties
type SidebarBase = {
  type: "link" | "accordion";
  label: string; // The label of the item
  icon: any; // The icon component
};

// Define the type for a simple "link" item
type SidebarLink = SidebarBase & {
  type: "link";
  link: string;
};

// Define the type for an "accordion" item
export type SidebarAccordionType = SidebarBase & {
  type: "accordion";
  baseLink: string;
  items: SidebarSubItemType[];
};

// Union type for all sidebar items
export type SidebarItem = SidebarLink | SidebarAccordionType;

// Array of sidebar content
export const sidebarContent: SidebarItem[] = [
  // Dashboard route
  {
    type: "link", // A regular link
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/",
  },
  // Vehicle Listings routes
  {
    type: "accordion",
    label: "Listings",
    baseLink: "/listings",
    icon: List,
    items: [
      { label: "Live Listings", link: "/listings/live" },
      { label: "New Listings", link: "/listings/new" },
      { label: "Updated Listings", link: "/listings/updated" },
      { label: "Pending Listings", link: "/listings/pending" },
      { label: "Rejected Listings", link: "/listings/rejected" },
      { label: "Price Alert", link: "/price-alert" },
    ],
  },
  // Agents/Company routes
  {
    type: "accordion",
    label: "Agents",
    baseLink: "/company",
    icon: UserPlus,
    items: [
      { label: "All Companies", link: "/company/registrations/live" },
      { label: "New Registrations", link: "/company/registrations/new" },
      {
        label: "Rejected Registrations",
        link: "/company/registrations/rejected",
      },
      { label: "Promotions", link: "/company/promotions" },
    ],
  },
  // srm
  {
    type: "accordion",
    label: "SRM",
    baseLink: "/srm",
    icon: Box,
    items: [
      {
        label: "Active Trips",
        link: "/srm/active-trips",
      },
      {
        label: "Completed Trips",
        link: "/srm/completed-trips",
      },
      {
        label: "Agents",
        link: "/srm/agents",
      },
      {
        label: "Vehicles",
        link: "/srm/vehicles",
      },
      {
        label: "Customers",
        link: "/srm/customers",
      },
    ],
  },
  // Categories and types routes
  {
    type: "accordion", // An expandable accordion
    label: "Categories & Types",
    icon: CarFront,
    baseLink: "/vehicle",
    items: [
      { label: "Categories", link: "/vehicle/manage-categories/" },
      { label: "Vehicle Types", link: "/vehicle/manage-types/" },
    ],
  },
  // Brands route
  {
    type: "link",
    label: "Brands",
    icon: Star,
    link: "/manage-brands",
  },
  // Vehicle Series route
  {
    type: "link",
    label: "Vehicle Series",
    icon: Group,
    link: "/manage-series",
  },
  // Locations routes
  {
    type: "accordion",
    label: "Locations",
    icon: MapPin,
    baseLink: "/locations",
    items: [
      { label: "Countries", link: "/locations/manage-countries" },
      { label: "States", link: "/locations/manage-states" },
      { label: "Cities", link: "/locations/manage-cities" },
    ],
  },
  // Marketing routes
  {
    type: "accordion",
    label: "Links & Promotions",
    baseLink: "/marketing",
    icon: Megaphone,
    items: [
      { label: "Quick Links", link: "/marketing/quick-links" },
      { label: "Related Links", link: "/marketing/related-links" },
      { label: "Promotions", link: "/marketing/promotions" },
    ],
  },

  // Ride Rent Blogs routes
  {
    type: "accordion",
    label: "Ride Blogs",
    baseLink: "/ride",
    icon: FileText,
    items: [
      { label: "Ride Blogs", link: "/ride-blogs/list" },
      { label: "Promotions - Ride Blog", link: "/ride-blogs/promotions" },
    ],
  },

  // Advisor Blogs routes
  {
    type: "accordion",
    label: "Advisor",
    baseLink: "/advisor",
    icon: FileText,
    items: [
      { label: "Advisor Blogs", link: "/advisor/blogs" },
      { label: "Promotions - Advisor", link: "/advisor/promotions" },
    ],
  },

  // Meta Data routes
  {
    type: "accordion",
    label: "Meta Data",
    baseLink: "/meta-data",
    icon: FileSearch,
    items: [
      { label: "Home Page", link: "/meta-data/home" },
      { label: "Listings Page", link: "/meta-data/listing?tab=category" },
    ],
  },
  // Careers
  {
    type: "accordion",
    label: "Careers",
    baseLink: "/careers",
    icon: GraduationCap,
    items: [
      { label: "Jobs", link: "/careers/jobs" },
      { label: "Applications", link: "/careers/applications" },
    ],
  },
  {
    type: "link",
    label: "Downloads",
    icon: CloudDownload,
    link: "/download",
  },
  // Price Matching page
];
