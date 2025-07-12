import { lazy } from "react";
import { Navigate } from "react-router-dom";

//  links page import
const ManageLinksPage = lazy(
  () => import("../../pages/quick-links/ManageLinksPage"),
);
const AddLinkPage = lazy(() => import("../../pages/quick-links/AddLinkPage"));
const EditLinkPage = lazy(() => import("../../pages/quick-links/EditLinkPage"));

// recommended links pages
const ManageRelatedLinksPage = lazy(
  () => import("../../pages/related-links/ManageRelatedLinksPage"),
);
const AddRelatedLinkPage = lazy(
  () => import("../../pages/related-links/AddRelatedLinkPage"),
);
const EditRelatedLinkPage = lazy(
  () => import("../../pages/related-links/EditRelatedLinkPage"),
);

// ads page import
const ManagePromotionsPage = lazy(
  () => import("../../pages/promotions/main-promotions/ManagePromotionsPage"),
);
const AddPromotionPage = lazy(
  () => import("../../pages/promotions/main-promotions/AddPromotionPage"),
);
const EditPromotionPage = lazy(
  () => import("../../pages/promotions/main-promotions/EditPromotionPage"),
);

export const linkAndPromotionRoutes = [
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
];
