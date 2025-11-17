import { lazy } from "react";
import { Navigate } from "react-router-dom";

const AlertDashboard = lazy(
  () => import("@/pages/updates/updatesDashboard"),
);

const VehiclesWithStateLocationPage = lazy(
  () => import("../../pages/updates/updateListingpage"),
);

export const updatesRoutes = [
  {
    path: "/alert-updates",
    element: <Navigate to="/alert-updates/dashboard" />,
  },
  {
    path: "/alert-updates/dashboard",
    element: <AlertDashboard />,
  },
  {
    path: "/alert-updates/new-listing",
    element: (
      <VehiclesWithStateLocationPage
        queryKey={["alerts,new-listing"]}
        approvalStatus="UNDER_REVIEW"
        title="New Listing"
        newRegistration={true}
      />
    ),
  },
  {
    path: "/alert-updates/updated-listing",
    element: (
      <VehiclesWithStateLocationPage
        queryKey={["alerts,updated-listing"]}
        approvalStatus="UNDER_REVIEW"
        title="Updated Listing"
        isModified={true}
      />
    ),
  },
  {
    path: "/alert-updates/pending-listing",
    element: (
      <VehiclesWithStateLocationPage
        queryKey={["alerts,pending-listing"]}
        approvalStatus="PENDING"
        title="Pending Listing"
        newRegistration={true}
      />
    ),
  },
];