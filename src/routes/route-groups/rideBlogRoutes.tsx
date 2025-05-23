import { lazy } from "react";

// blogs promotions page import
const ManageRideBlogsPage = lazy(
  () => import("../../pages/ride-blogs/ManageRideBlogsPage"),
);
const AddRideBlogPage = lazy(
  () => import("../../pages/ride-blogs/AddRideBlogPage"),
);
const EditRideBlogPage = lazy(
  () => import("../../pages/ride-blogs/EditRideBlogPage"),
);

// blogs page import
const ManageRideBlogsPromotionsPage = lazy(
  () =>
    import(
      "../../pages/promotions/ride-blog-promotions/ManageRideBlogPromotionPage"
    ),
);
const AddRideBlogPromotionsPage = lazy(
  () =>
    import(
      "../../pages/promotions/ride-blog-promotions/AddRideBlogPromotionPage"
    ),
);
const EditRideBlogPromotionsPage = lazy(
  () =>
    import(
      "../../pages/promotions/ride-blog-promotions/EditRideBlogPromotionPage"
    ),
);

export const rideBlogRoutes = [
  // ride blogs routes
  {
    path: "/ride-blogs/list",
    element: <ManageRideBlogsPage />,
  },
  {
    path: "/ride-blogs/add",
    element: <AddRideBlogPage />,
  },
  {
    path: "/ride-blogs/edit/:blogId",
    element: <EditRideBlogPage />,
  },

  // ride blog promotions
  {
    path: "/ride-blogs/promotions",
    element: <ManageRideBlogsPromotionsPage />,
  },
  {
    path: "/ride-blogs/promotions/add",
    element: <AddRideBlogPromotionsPage />,
  },
  {
    path: "/ride-blogs/promotions/edit/:promotionId",
    element: <EditRideBlogPromotionsPage />,
  },
];
