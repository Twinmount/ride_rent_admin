import { lazy } from "react";

// country  pages
const ManageCountryPage = lazy(
  () => import("../../pages/countries/ManageCountryPage"),
);
const AddCountryPage = lazy(
  () => import("../../pages/countries/AddCountryPage"),
);
const EditCountryPage = lazy(
  () => import("../../pages/countries/EditCountryPage"),
);

// states pages
const ManageStatesPage = lazy(
  () => import("../../pages/states/ManageStatesPage"),
);
const AddStatePage = lazy(() => import("../../pages/states/AddStatePage"));
const EditStatePage = lazy(() => import("../../pages/states/EditStatePage"));

// city pages imports
const ManageCitiesPage = lazy(
  () => import("../../pages/cities/ManageCitiesPage"),
);
const AddCityPage = lazy(() => import("../../pages/cities/AddCityPage"));
const EditCityPage = lazy(() => import("../../pages/cities/EditCityPage"));

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
