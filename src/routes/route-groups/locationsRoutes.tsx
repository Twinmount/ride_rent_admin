import { lazy } from "react";

// country  pages
const ManageCountryPage = lazy(
  () => import("../../pages/manage-countries/ManageCountryPage"),
);
const AddCountryPage = lazy(
  () => import("../../pages/manage-countries/AddCountryPage"),
);
const EditCountryPage = lazy(
  () => import("../../pages/manage-countries/EditCountryPage"),
);

// states pages
const ManageStatesPage = lazy(
  () => import("../../pages/manage-states/ManageStatesPage"),
);
const AddStatePage = lazy(
  () => import("../../pages/manage-states/AddStatePage"),
);
const EditStatePage = lazy(
  () => import("../../pages/manage-states/EditStatePage"),
);

// city pages imports
const ManageCitiesPage = lazy(
  () => import("../../pages/manage-cities/ManageCitiesPage"),
);
const AddCityPage = lazy(() => import("../../pages/manage-cities/AddCityPage"));
const EditCityPage = lazy(
  () => import("../../pages/manage-cities/EditCityPage"),
);

export const locationsRoutes = [
  // state route
  {
    path: "/locations/manage-states",
    element: <ManageStatesPage />,
  },
  {
    path: "/locations/manage-states/add",
    element: <AddStatePage />,
  },
  {
    path: "/locations/manage-states/edit/:stateId",
    element: <EditStatePage />,
  },

  // country route
  {
    path: "/locations/manage-countries",
    element: <ManageCountryPage />,
  },
  {
    path: "/locations/manage-countries/add",
    element: <AddCountryPage />,
  },
  {
    path: "/locations/manage-countries/edit/:countryId",
    element: <EditCountryPage />,
  },

  // cities route
  {
    path: "/locations/manage-cities",
    element: <ManageCitiesPage />,
  },
  {
    path: "/locations/manage-cities/add",
    element: <AddCityPage />,
  },
  {
    path: "/locations/manage-cities/edit/:cityId",
    element: <EditCityPage />,
  },
];
