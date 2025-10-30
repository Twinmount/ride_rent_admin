import { lazy } from "react";

// supplier dashboard page
const SupplierCentralDashboard = lazy(
  () => import("../../pages/supplier-central/Dashboard"),
);

// supplier listing page
const SupplierListingPage = lazy(
  () => import("../../pages/supplier-central/supplierListingPage"),
);

const SupplierDetailsPage = lazy(
  () => import("../../pages/supplier-central/supplierDetailPage"),
);

export const supplierRoutes = [
  {
    path: "/suppliercentral/dashboard",
    element: <SupplierCentralDashboard />,
  },
  {
    path: "/suppliercentral/category/:category",
    element: (
      <SupplierListingPage
        queryKey={["suppliers", "category"]}
      />
    ),
  },
  {
    path: "/supplier/registrations/view/:supplierId",
    element: <SupplierDetailsPage />,
  },
  
];