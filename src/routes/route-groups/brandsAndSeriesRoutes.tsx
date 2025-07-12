import { lazy } from "react";
// brands page import
const BrandsPage = lazy(() => import("../../pages/manage-brands/BrandsPage"));
const AddBrandPage = lazy(
  () => import("../../pages/manage-brands/AddBrandPage"),
);
const EditBrandPage = lazy(
  () => import("../../pages/manage-brands/EditBrandPage"),
);

const SeriesPage = lazy(() => import("../../pages/manage-series/SeriesPage"));
const AddSeriesPage = lazy(
  () => import("../../pages/manage-series/AddSeriesPage"),
);
const EditSeriesPage = lazy(
  () => import("../../pages/manage-series/EditSeriesPage"),
);

export const brandsAndSeriesRoutes = [
  // brands routes
  {
    path: "/manage-brands",
    element: <BrandsPage />,
  },
  {
    path: "/manage-brands/:vehicleCategoryId",
    element: <BrandsPage />,
  },
  {
    path: "/manage-brands/:vehicleCategoryId/add-brand",
    element: <AddBrandPage />,
  },
  {
    path: "/manage-brands/edit/:brandId",
    element: <EditBrandPage />,
  },

  // series routes
  {
    path: "/manage-series",
    element: <SeriesPage />,
  },
  {
    path: "/manage-series/add",
    element: <AddSeriesPage />,
  },
  {
    path: "/manage-series/edit/:vehicleSeriesId",
    element: <EditSeriesPage />,
  },
];
