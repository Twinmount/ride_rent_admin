import { lazy } from "react";

const SRMActiveTripsPage = lazy(
  () => import("../../pages/srm/srm-trips/SRMActiveTripsPage"),
);
const SRMCompletedTripsPage = lazy(
  () => import("../../pages/srm/srm-trips/SRMCompletedTripsPage"),
);
const SRMSellersPage = lazy(
  () => import("../../pages/srm/srm-sellers/SRMSellersPage"),
);
const SRMVehiclesPage = lazy(
  () => import("../../pages/srm/srm-vehicles/SRMVehiclesPage"),
);
const SRMCustomerPage = lazy(
  () => import("../../pages/srm/srm-customer/SRMCustomerPage"),
);
const SRMCustomerAddPage = lazy(
  () => import("../../pages/srm/srm-customer/SRMCustomerAddPage"),
);
const SRMCustomerUpdatePage = lazy(
  () => import("../../pages/srm/srm-customer/SRMCustomerUpdatePage"),
);

export const srmRoutes = [
  {
    path: "/srm/active-trips",
    element: <SRMActiveTripsPage />,
  },
  {
    path: "/srm/completed-trips",
    element: <SRMCompletedTripsPage />,
  },
  {
    path: "/srm/sellers",
    element: <SRMSellersPage />,
  },
  {
    path: "/srm/vehicles",
    element: <SRMVehiclesPage />,
  },
  {
    path: "/srm/customers",
    element: <SRMCustomerPage />,
  },
  {
    path: "/srm/customers/add",
    element: <SRMCustomerAddPage />,
  },
  {
    path: "/srm/customers/edit/:customerId",
    element: <SRMCustomerUpdatePage />,
  },
];
