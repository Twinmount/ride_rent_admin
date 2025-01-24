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
} from "lucide-react";

// Sidebar content
export const sidebarContent = [
  {
    type: "link", // A regular link
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/",
  },
  {
    type: "accordion",
    label: "Listings",
    baseLink: "/listings", // Base link for all items in this accordion
    icon: List,
    items: [
      { label: "Live Listings", link: "/listings/live" },
      { label: "New Listings", link: "/listings/new" },
      { label: "Updated Listings", link: "/listings/updated" },
      { label: "Pending Listings", link: "/listings/pending" },
      { label: "Rejected Listings", link: "/listings/rejected" },
    ],
  },
  {
    type: "link",
    label: "Agents",
    icon: UserPlus,
    link: "/registrations",
  },
  {
    type: "accordion", // An expandable accordion
    label: "Categories & Types",
    icon: CarFront,
    items: [
      { label: "Categories", link: "/categories" },
      { label: "Vehicle Types", link: "/vehicle-types" },
    ],
  },
  {
    type: "link",
    label: "Brands",
    icon: Star,
    link: "/manage-brands",
  },
  {
    type: "accordion",
    label: "Locations",
    icon: MapPin,
    items: [
      { label: "Cities", link: "/locations/cities" },
      { label: "States", link: "/locations/states" },
    ],
  },
  {
    type: "link",
    label: "Links & Promotions",
    icon: Megaphone,
    link: "/marketing",
  },
  {
    type: "link",
    label: "Blogs",
    icon: FileText,
    link: "/happenings",
  },
  {
    type: "link",
    label: "Meta Data",
    icon: FileSearch,
    link: "/meta-data",
  },
];
