import { lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

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

// lazy loaded pages
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const LiveListingPage = lazy(
  () => import("../pages/live-listing/LiveListingPage"),
);

const GeneralListingPage = lazy(
  () => import("../pages/live-listing/GeneralListingPage"),
);
const VehiclesFormUpdatePage = lazy(
  () => import("../pages/live-listing/VehiclesFormUpdatePage"),
);
const VehiclesFormAddPage = lazy(
  () => import("../pages/live-listing/VehiclesFormAddPage"),
);

// company registrations page
const CompanyListingPage = lazy(
  () => import("../pages/company/CompanyListingPage"),
);
const CompanyDetailsPage = lazy(
  () => import("../pages/company/CompanyDetailsPage"),
);
const CompanyPromotionPage = lazy(
  () => import("../pages/company/CompanyPromotionPage"),
);
// vehicle categories page imports
const ManageCategoriesPage = lazy(
  () => import("../pages/manage-categories/ManageCategoriesPage"),
);
const AddCategoryPage = lazy(
  () => import("../pages/manage-categories/AddCategoryPage"),
);
const EditCategoryPage = lazy(
  () => import("../pages/manage-categories/EditCategoryPage"),
);

// vehicle types page import
const ManageTypesPage = lazy(
  () => import("../pages/manage-types/ManageTypesPage"),
);
const EditTypePage = lazy(() => import("../pages/manage-types/EditTypePage"));
const AddTypePage = lazy(() => import("../pages/manage-types/AddTypePage"));

// brands page import
const BrandsPage = lazy(() => import("../pages/manage-brands/BrandsPage"));
const AddBrandPage = lazy(() => import("../pages/manage-brands/AddBrandPage"));
const EditBrandPage = lazy(
  () => import("../pages/manage-brands/EditBrandPage"),
);

const SeriesPage = lazy(() => import("../pages/manage-series/SeriesPage"));
const AddSeriesPage = lazy(
  () => import("../pages/manage-series/AddSeriesPage"),
);
const EditSeriesPage = lazy(
  () => import("../pages/manage-series/EditSeriesPage"),
);

// country page pages
const ManageCountryPage = lazy(
  () => import("../pages/manage-countries/ManageCountryPage"),
);
const AddCountryPage = lazy(
  () => import("../pages/manage-countries/AddCountryPage"),
);
const EditCountryPage = lazy(
  () => import("../pages/manage-countries/EditCountryPage"),
);

// states page pages
const ManageStatesPage = lazy(
  () => import("../pages/manage-states/ManageStatesPage"),
);
const AddStatePage = lazy(() => import("../pages/manage-states/AddStatePage"));
const EditStatePage = lazy(
  () => import("../pages/manage-states/EditStatePage"),
);

// city pages imports
const ManageCitiesPage = lazy(
  () => import("../pages/manage-cities/ManageCitiesPage"),
);
const AddCityPage = lazy(() => import("../pages/manage-cities/AddCityPage"));
const EditCityPage = lazy(() => import("../pages/manage-cities/EditCityPage"));

//  links page import
const ManageLinksPage = lazy(
  () => import("../pages/quick-links/ManageLinksPage"),
);
const AddLinkPage = lazy(() => import("../pages/quick-links/AddLinkPage"));
const EditLinkPage = lazy(() => import("../pages/quick-links/EditLinkPage"));

// recommended links pages
const ManageRelatedLinksPage = lazy(
  () => import("../pages/related-links/ManageRelatedLinksPage"),
);
const AddRelatedLinkPage = lazy(
  () => import("../pages/related-links/AddRelatedLinkPage"),
);
const EditRelatedLinkPage = lazy(
  () => import("../pages/related-links/EditRelatedLinkPage"),
);

// ads page import
const ManagePromotionsPage = lazy(
  () => import("../pages/promotions/main-promotions/ManagePromotionsPage"),
);
const AddPromotionPage = lazy(
  () => import("../pages/promotions/main-promotions/AddPromotionPage"),
);
const EditPromotionPage = lazy(
  () => import("../pages/promotions/main-promotions/EditPromotionPage"),
);

// meta data page routes
const HomeMetaDataPage = lazy(
  () => import("../pages/meta-data/home-meta/HomeMetaDataPage"),
);
const AddHomeMetaPage = lazy(
  () => import("../pages/meta-data/home-meta/AddHomeMetaPage"),
);
const EditHomeMetaPage = lazy(
  () => import("../pages/meta-data/home-meta/EditHomeMetaPage"),
);
const ListingMetaDataPage = lazy(
  () => import("../pages/meta-data/listing-meta/ListingMetaDataPage"),
);
const AddListingMetaPage = lazy(
  () => import("../pages/meta-data/listing-meta/AddListingMetaPage"),
);
const EditListingMetaPage = lazy(
  () => import("../pages/meta-data/listing-meta/EditListingMetaPage"),
);

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
              // dashboard route
              { path: "/", element: <Dashboard /> },

              // vehicle listing routes
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

              // Company routes
              {
                path: "/company/registrations/live",
                element: (
                  <CompanyListingPage
                    queryKey={["companies", "all-companies"]}
                    approvalStatus="APPROVED"
                    title="All Registrations"
                  />
                ),
              },
              {
                path: "/company/registrations/new",
                element: (
                  <CompanyListingPage
                    queryKey={["companies", "new-companies"]}
                    approvalStatus="PENDING"
                    title="New Registrations"
                  />
                ),
              },

              {
                path: "/company/registrations/rejected",
                element: (
                  <CompanyListingPage
                    queryKey={["companies", "rejected-companies"]}
                    approvalStatus="REJECTED"
                    title="Rejected Registrations"
                  />
                ),
              },

              {
                path: "/company/registrations/view/:companyId",
                element: <CompanyDetailsPage />,
              },
              {
                path: "/company/promotions",
                element: <CompanyPromotionPage />,
              },

              // vehicle category route
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

              // quick links route
              {
                path: "/marketing",
                element: <Navigate to={"/marketing/quick-links"} />,
              },
              { path: "/marketing/quick-links", element: <ManageLinksPage /> },
              { path: "/marketing/quick-links/add", element: <AddLinkPage /> },
              {
                path: "/marketing/quick-links/edit/:linkId",
                element: <EditLinkPage />,
              },

              // recommended links routes
              {
                path: "/marketing/related-links",
                element: <ManageRelatedLinksPage />,
              },
              {
                path: "/marketing/related-links/add",
                element: <AddRelatedLinkPage />,
              },
              {
                path: "/marketing/related-links/edit/:linkId",
                element: <EditRelatedLinkPage />,
              },

              // promotions route
              {
                path: "/marketing/promotions",
                element: <ManagePromotionsPage />,
              },
              {
                path: "/marketing/promotions/add",
                element: <AddPromotionPage />,
              },
              {
                path: "/marketing/promotions/edit/:promotionId",
                element: <EditPromotionPage />,
              },

              // home page meta data routes
              {
                path: "/meta-data",
                element: <Navigate to={"/meta-data/home"} />,
              },
              { path: "/meta-data/home", element: <HomeMetaDataPage /> },
              { path: "/meta-data/home/add", element: <AddHomeMetaPage /> },
              {
                path: "/meta-data/home/edit/:metaDataId",
                element: <EditHomeMetaPage />,
              },

              // listing page meta data routes
              {
                path: "/meta-data/listing",
                element: <ListingMetaDataPage />,
              },
              {
                path: "/meta-data/listing/add",
                element: <AddListingMetaPage />,
              },
              {
                path: "/meta-data/listing/edit/:metaDataId",
                element: <EditListingMetaPage />,
              },

              // Career Routes
              ...careersRoutes,

              // ride blog routes
              ...rideBlogRoutes,

              // advisor routes
              ...advisorRoutes,

              // srm routes
              ...srmRoutes,
            ],
          },
        ],
      },
    ],
  },
]);
