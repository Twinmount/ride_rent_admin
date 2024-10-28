import { lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// core styles are required for all packages
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import Layout from "./layout/Layout";
import ErrorPage from "./pages/ErrorPage";

// pages import
import Login from "./pages/login/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ProtectedRoute from "./layout/ProtectedRoutes";

import { toast } from "./components/ui/use-toast";
import { AdminProvider } from "./context/AdminContext";
import RouteErrorBoundary from "./layout/RouteErrorBoundary";

// lazy loaded pages
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const LiveListingPage = lazy(
  () => import("./pages/live-listing/LiveListingPage")
);

const GeneralListingPage = lazy(
  () => import("./pages/live-listing/GeneralListingPage")
);
const VehiclesFormUpdatePage = lazy(
  () => import("./pages/live-listing/VehiclesFormUpdatePage")
);
const VehiclesFormAddPage = lazy(
  () => import("./pages/live-listing/VehiclesFormAddPage")
);

// company registrations page

const GeneralCompaniesPage = lazy(
  () => import("./pages/company/GeneralCompaniesPage")
);
const CompanyDetailsPage = lazy(
  () => import("./pages/company/CompanyDetailsPage")
);
// vehicle categories page imports
const ManageCategoriesPage = lazy(
  () => import("./pages/manage-categories/ManageCategoriesPage")
);
const AddCategoryPage = lazy(
  () => import("./pages/manage-categories/AddCategoryPage")
);
const EditCategoryPage = lazy(
  () => import("./pages/manage-categories/EditCategoryPage")
);

// vehicle types page import
const ManageTypesPage = lazy(
  () => import("./pages/manage-types/ManageTypesPage")
);
const EditTypePage = lazy(() => import("./pages/manage-types/EditTypePage"));
const AddTypePage = lazy(() => import("./pages/manage-types/AddTypePage"));

// brands page import
const ManageBrandsPage = lazy(
  () => import("./pages/manage-brands/ManageBrandsPage")
);
const AddBrandPage = lazy(() => import("./pages/manage-brands/AddBrandPage"));
const EditBrandPage = lazy(() => import("./pages/manage-brands/EditBrandPage"));

// states page pages
const ManageStatesPage = lazy(
  () => import("./pages/manage-states/ManageStatesPage")
);
const AddStatePage = lazy(() => import("./pages/manage-states/AddStatePage"));
const EditStatePage = lazy(() => import("./pages/manage-states/EditStatePage"));

// city pages imports
const ManageCitiesPage = lazy(
  () => import("./pages/manage-cities/ManageCitiesPage")
);
const AddCityPage = lazy(() => import("./pages/manage-cities/AddCityPage"));
const EditCityPage = lazy(() => import("./pages/manage-cities/EditCityPage"));

//  links page import
const ManageLinksPage = lazy(
  () => import("./pages/quick-links/ManageLinksPage")
);
const AddLinkPage = lazy(() => import("./pages/quick-links/AddLinkPage"));
const EditLinkPage = lazy(() => import("./pages/quick-links/EditLinkPage"));

// recommended links pages
const ManageRecommendedLinksPage = lazy(
  () => import("./pages/recommended-links/ManageRecommendedLinksPage")
);
const AddRecommendedLinkPage = lazy(
  () => import("./pages/recommended-links/AddRecommendedLinkPage")
);
const EditRecommendedLinkPage = lazy(
  () => import("./pages/recommended-links/EditRecommendedLinkPage")
);

// ads page import
const ManagePromotionsPage = lazy(
  () => import("./pages/promotions/main-promotions/ManagePromotionsPage")
);
const AddPromotionPage = lazy(
  () => import("./pages/promotions/main-promotions/AddPromotionPage")
);
const EditPromotionPage = lazy(
  () => import("./pages/promotions/main-promotions/EditPromotionPage")
);
// blogs promotions page import
const ManageBlogsPage = lazy(() => import("./pages/blogs/ManageBlogsPage"));
const AddBlogPage = lazy(() => import("./pages/blogs/AddBlogPage"));
const EditBlogPage = lazy(() => import("./pages/blogs/EditBlogPage"));

// blogs page import
const ManageBlogsPromotionsPage = lazy(
  () => import("./pages/promotions/blog-promotions/ManageBlogsPromotionsPage")
);
const AddBlogPromotionsPage = lazy(
  () => import("./pages/promotions/blog-promotions/AddBlogsPromotionPage")
);
const EditBlogPromotionsPage = lazy(
  () => import("./pages/promotions/blog-promotions/EditBlogsPromotionPage")
);
// meta data page routes
const HomeMetaDataPage = lazy(
  () => import("./pages/meta-data/home-meta/HomeMetaDataPage")
);
const AddHomeMetaPage = lazy(
  () => import("./pages/meta-data/home-meta/AddHomeMetaPage")
);
const EditHomeMetaPage = lazy(
  () => import("./pages/meta-data/home-meta/EditHomeMetaPage")
);
const ListingMetaDataPage = lazy(
  () => import("./pages/meta-data/listing-meta/ListingMetaDataPage")
);
const AddListingMetaPage = lazy(
  () => import("./pages/meta-data/listing-meta/AddListingMetaPage")
);
const EditListingMetaPage = lazy(
  () => import("./pages/meta-data/listing-meta/EditListingMetaPage")
);

const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      // login route
      { path: "/login", element: <Login /> },
      // register and OTP route (just for the first time admin account creation only)
      { path: "/register", element: <Register /> },
      { path: "/verify-otp", element: <VerifyOTP /> },

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
                path: "/listings/add/:userId",
                element: <VehiclesFormAddPage />,
              },
              {
                path: "/listings/edit/:vehicleId/:companyId/:userId",
                element: <VehiclesFormUpdatePage />,
              },

              // Company routes
              {
                path: "/registrations",
                element: (
                  <GeneralCompaniesPage
                    queryKey={["companies", "all-companies"]}
                    approvalStatus="APPROVED"
                    title="All Registrations"
                  />
                ),
              },
              {
                path: "/registrations/new",
                element: (
                  <GeneralCompaniesPage
                    queryKey={["companies", "new-companies"]}
                    approvalStatus="PENDING"
                    title="New Registrations"
                  />
                ),
              },

              {
                path: "/registrations/rejected",
                element: (
                  <GeneralCompaniesPage
                    queryKey={["companies", "rejected-companies"]}
                    approvalStatus="REJECTED"
                    title="Rejected Registrations"
                  />
                ),
              },

              {
                path: "/registrations/view/:companyId",
                element: <CompanyDetailsPage />,
              },

              // vehicle category route
              {
                path: "/vehicle",
                element: <Navigate to={"/vehicle/manage-categories"} />,
              },
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
                element: <ManageBrandsPage />,
              },
              {
                path: "/manage-brands/:vehicleCategoryId",
                element: <ManageBrandsPage />,
              },
              {
                path: "/manage-brands/:vehicleCategoryId/add-brand",
                element: <AddBrandPage />,
              },
              {
                path: "/manage-brands/edit/:brandId",
                element: <EditBrandPage />,
              },

              // state route
              {
                path: "/locations/",
                element: <Navigate to={"/locations/manage-states"} />,
              },
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
                path: "/marketing/recommended-links",
                element: <ManageRecommendedLinksPage />,
              },
              {
                path: "/marketing/recommended-links/add",
                element: <AddRecommendedLinkPage />,
              },
              {
                path: "/marketing/recommended-links/edit/:linkId",
                element: <EditRecommendedLinkPage />,
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

              // blogs routes
              {
                path: "/happenings",
                element: <Navigate to={"/happenings/blogs"} />,
              },
              {
                path: "/happenings/blogs",
                element: <ManageBlogsPage />,
              },
              {
                path: "/happenings/blogs/add",
                element: <AddBlogPage />,
              },
              {
                path: "/happenings/blogs/edit/:blogId",
                element: <EditBlogPage />,
              },

              // blog promotions
              {
                path: "/happenings/promotions",
                element: <ManageBlogsPromotionsPage />,
              },
              {
                path: "/happenings/promotions/add",
                element: <AddBlogPromotionsPage />,
              },
              {
                path: "/happenings/promotions/edit/:promotionId",
                element: <EditBlogPromotionsPage />,
              },

              // meta data routes
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
            ],
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
  }),
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <RouteErrorBoundary>
          <RouterProvider router={router} />
        </RouteErrorBoundary>
      </AdminProvider>
    </QueryClientProvider>
  );
}
