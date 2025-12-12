import { lazy } from "react";

// vehicle categories page imports
const ManageCategoriesPage = lazy(
  () => import("../../pages/vehicle-categories/ManageCategoriesPage"),
);
const AddCategoryPage = lazy(
  () => import("../../pages/vehicle-categories/AddCategoryPage"),
);
const EditCategoryPage = lazy(
  () => import("../../pages/vehicle-categories/EditCategoryPage"),
);

// vehicle types page import
const ManageTypesPage = lazy(
  () => import("../../pages/vehicle-types/ManageTypesPage"),
);
const EditTypePage = lazy(
  () => import("../../pages/vehicle-types/EditTypePage"),
);
const AddTypePage = lazy(() => import("../../pages/vehicle-types/AddTypePage"));

export const categoryAndVehicleTypeRoutes = [
  {
    path: "/vehicle/manage-categories/",
    element: <ManageCategoriesPage />,
  },
  {
    path: "/vehicle/manage-categories/add",
    element: <AddCategoryPage />,
  },
  {
    path: "/vehicle/manage-categories/edit/:categoryId",
    element: <EditCategoryPage />,
  },

  //vehicle types routes
  {
    path: "/vehicle/manage-types",
    element: <ManageTypesPage />,
  },
  {
    path: "/vehicle/manage-types/:vehicleCategoryId",
    element: <ManageTypesPage />,
  },
  {
    path: "/vehicle/manage-types/:vehicleCategoryId/add",
    element: <AddTypePage />,
  },
  {
    path: "/vehicle/manage-types/:vehicleCategoryId/edit/:vehicleTypeId",
    element: <EditTypePage />,
  },
];
