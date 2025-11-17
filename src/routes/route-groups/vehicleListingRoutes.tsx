import { lazy } from "react";
import { Navigate } from "react-router-dom";

const LiveListingPage = lazy(
  () => import("../../pages/vehicle-listing/LiveListingPage"),
);

const GeneralListingPage = lazy(
  () => import("../../pages/vehicle-listing/GeneralListingPage"),
);
const VehiclesFormUpdatePage = lazy(
  () => import("../../pages/vehicle-listing/VehiclesFormUpdatePage"),
);
const VehiclesFormAddPage = lazy(
  () => import("../../pages/vehicle-listing/VehiclesFormAddPage"),
);

export const vehicleListingRoutes = [
  {
    path: "/listings",
    element: <Navigate to={"/listings/live"} />,
  },
  {
    path: "/listings/live",
    element: <LiveListingPage />,
  },

  {
    path: "/listings/new",
    element: (
      <GeneralListingPage
        queryKey={["listings,new-listings"]}
        approvalStatus="UNDER_REVIEW"
        title="New Listings"
        isModified={false}
        newRegistration={true}
      />
    ),
  },
  {
    path: "/listings/updated",
    element: (
      <GeneralListingPage
        queryKey={["listings,updated-listings"]}
        approvalStatus="UNDER_REVIEW"
        title="Updated Listings"
        isModified={true}
      />
    ),
  },
  {
    path: "/listings/rejected",
    element: (
      <GeneralListingPage
        queryKey={["listings,rejected-listings"]}
        approvalStatus="REJECTED"
        title="Rejected Listings"
        isModified={false}
      />
    ),
  },
  {
    path: "/listings/pending",
    element: (
      <GeneralListingPage
        queryKey={["listings,pending-listings"]}
        approvalStatus="PENDING"
        title="Rejected Listings"
        newRegistration={true}
      />
    ),
  },
  {
    path: "/listings/add/:userId/:companyId",
    element: <VehiclesFormAddPage />,
  },
  {
    path: "/listings/edit/:vehicleId/:companyId/:userId",
    element: <VehiclesFormUpdatePage />,
  },
];
