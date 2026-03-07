import { lazy } from "react";

// company registrations page
const CoupenListingPage = lazy(
  () => import("../../pages/coupen/coupenListingPage"),
);

export const coupenRoutes = [
  {
    path: "/coupen/dashboard",
    element: (
      <CoupenListingPage
        queryKey={["coupons", "all-coupons"]}
        title="All Coupons"
      />
    ),
  },
];