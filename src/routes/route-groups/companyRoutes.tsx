import { lazy } from "react";

// company registrations page
const CompanyListingPage = lazy(
  () => import("../../pages/company/CompanyListingPage"),
);
const CompanyDetailsPage = lazy(
  () => import("../../pages/company/CompanyDetailsPage"),
);
const CompanyPromotionPage = lazy(
  () => import("../../pages/company/CompanyPromotionPage"),
);

export const companyRoutes = [
  {
    path: "/company/registrations/live",
    element: (
      <CompanyListingPage
        queryKey={["companies", "all-companies"]}
        approvalStatus="APPROVED"
        title="All Registrations"
      />
    ),
  },
  {
    path: "/company/registrations/new",
    element: (
      <CompanyListingPage
        queryKey={["companies", "new-companies"]}
        approvalStatus="PENDING"
        title="New Registrations"
      />
    ),
  },

  {
    path: "/company/registrations/rejected",
    element: (
      <CompanyListingPage
        queryKey={["companies", "rejected-companies"]}
        approvalStatus="REJECTED"
        title="Rejected Registrations"
      />
    ),
  },

  {
    path: "/company/registrations/view/:companyId",
    element: <CompanyDetailsPage />,
  },
  {
    path: "/company/promotions",
    element: <CompanyPromotionPage />,
  },
];
