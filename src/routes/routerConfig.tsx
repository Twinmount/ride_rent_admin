import { lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

// core styles are required for all packages
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import Layout from "../layout/Layout";
import ErrorPage from "../pages/ErrorPage";

// pages import
import Login from "../pages/login/Login";
import Register from "../pages/Register";
import VerifyOTP from "../pages/VerifyOTP";
import ProtectedRoute from "../layout/ProtectedRoutes";
import { rideBlogRoutes } from "./route-groups/rideBlogRoutes";
import { advisorRoutes } from "./route-groups/advisorRoutes";
import { careersRoutes } from "./route-groups/careersRoutes";
import { srmRoutes } from "./route-groups/srmRoutes";
import { companyRoutes } from "./route-groups/companyRoutes";
import { vehicleListingRoutes } from "./route-groups/vehicleListingRoutes";
import { metadataRoutes } from "./route-groups/metadataRoutes";
import { locationsRoutes } from "./route-groups/locationsRoutes";
import { categoryAndVehicleTypeRoutes } from "./route-groups/categoryAndVehicleTypeRoutes";
import { linkAndPromotionRoutes } from "./route-groups/linkAndPromotionRoutes";
import { brandsAndSeriesRoutes } from "./route-groups/brandsAndSeriesRoutes";
import { supplierRoutes } from "./route-groups/supplierCentralRoutes";
import { updatesRoutes } from "./route-groups/updatesRoutes";
import { vehicleBucketRoutes } from "./route-groups/vehicleBucketRoutes";

// lazy imports
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const DownloadPage = lazy(() => import("../pages/download/DownloadPage"));
const PriceMatchingPage = lazy(() => import("../pages/PriceMatchingPage"));
const AdminEnquiriesPage = lazy(
  () => import("../pages/enquiries/AdminEnquiriesPageNew"),
);
const ManageCachePage = lazy(() => import("../pages/cache/ManageCachePage"));
const UsersPage = lazy(() => import("../pages/users/UsersPage"));

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      // login route
      { path: "/login", element: <Login country="ae" /> },
      { path: "/in/login", element: <Login country="in" /> },
      // register and OTP route (just for the first time admin account creation only)
      { path: "/in/register", element: <Register country="in" /> },
      { path: "/in/verify-otp", element: <VerifyOTP country="in" /> },
      { path: "/ae/login", element: <Login country="ae" /> },
      // register and OTP route (just for the first time admin account creation only)
      { path: "/ae/register", element: <Register country="ae" /> },
      { path: "/ae/verify-otp", element: <VerifyOTP country="ae" /> },

      {
        element: <ProtectedRoute />,

        children: [
          {
            element: <Layout />,
            children: [
              // dashboard routes
              { path: "/", element: <Dashboard /> },

              // enquiries routes
              { path: "/enquiries", element: <AdminEnquiriesPage /> },

              // users routes
              { path: "/users", element: <UsersPage /> },

              // download routes
              { path: "/download", element: <DownloadPage /> },

              // price matching route
              { path: "/price-alert", element: <PriceMatchingPage /> },

              // cache manage route
              { path: "/manage-cache", element: <ManageCachePage /> },

              // vehicle listing routes
              ...vehicleListingRoutes,

              // company routes
              ...companyRoutes,

              // category and vehicle type routes
              ...categoryAndVehicleTypeRoutes,

              //  Series and Brands Routes
              ...brandsAndSeriesRoutes,

              // Quick Link, Related Link  and Promotion routes
              ...linkAndPromotionRoutes,

              // ride blog routes
              ...rideBlogRoutes,

              // advisor routes
              ...advisorRoutes,

              // srm routes
              ...srmRoutes,

              // locations routes
              ...locationsRoutes,

              // metadata routes
              ...metadataRoutes,

              // Career Routes
              ...careersRoutes,

              // Supplier Central Routes
              ...supplierRoutes,

              ...updatesRoutes,

              // vehicle bucket routes
              ...vehicleBucketRoutes,
            ],
          },
        ],
      },
    ],
  },
]);
