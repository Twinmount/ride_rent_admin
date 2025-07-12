import { lazy } from "react";
import { Navigate } from "react-router-dom";

// meta data page routes
const HomeMetaDataPage = lazy(
  () => import("../../pages/meta-data/home-meta/HomeMetaDataPage"),
);
const AddHomeMetaPage = lazy(
  () => import("../../pages/meta-data/home-meta/AddHomeMetaPage"),
);
const EditHomeMetaPage = lazy(
  () => import("../../pages/meta-data/home-meta/EditHomeMetaPage"),
);
const ListingMetaDataPage = lazy(
  () => import("../../pages/meta-data/listing-meta/ListingMetaDataPage"),
);
const AddListingMetaPage = lazy(
  () => import("../../pages/meta-data/listing-meta/AddListingMetaPage"),
);
const EditListingMetaPage = lazy(
  () => import("../../pages/meta-data/listing-meta/EditListingMetaPage"),
);

export const metadataRoutes = [
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
];
