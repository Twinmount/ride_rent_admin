import { lazy } from "react";

// blogs promotions page import
const ManageAdvisorBlogsPage = lazy(
  () => import("../../pages/advisor-blogs/ManageAdvisorBlogsPage"),
);
const AddAdvisorBlogPage = lazy(
  () => import("../../pages/advisor-blogs/AddAdvisorBlogPage"),
);
const EditAdvisorBlogPage = lazy(
  () => import("../../pages/advisor-blogs/EditAdvisorBlogPage"),
);

// blogs page import
const ManageAdvisorBlogPromotionsPage = lazy(
  () =>
    import(
      "../../pages/promotions/advisor-blog-promotions/ManageAdvisorBlogPromotionPage"
    ),
);
const AddAdvisorBlogPromotionPage = lazy(
  () =>
    import(
      "../../pages/promotions/advisor-blog-promotions/AddAdvisorBlogPromotionPage"
    ),
);
const EditAdvisorBlogPromotionPage = lazy(
  () =>
    import(
      "../../pages/promotions/advisor-blog-promotions/EditAdvisorBlogPromotionPage"
    ),
);

export const advisorRoutes = [
  // ride blogs routes
  {
    path: "/advisor/blogs",
    element: <ManageAdvisorBlogsPage />,
  },
  {
    path: "/advisor/blogs/add",
    element: <AddAdvisorBlogPage />,
  },
  {
    path: "/advisor/blogs/edit/:blogId",
    element: <EditAdvisorBlogPage />,
  },

  // ride blog promotions
  {
    path: "/advisor/promotions",
    element: <ManageAdvisorBlogPromotionsPage />,
  },
  {
    path: "/advisor/promotions/add",
    element: <AddAdvisorBlogPromotionPage />,
  },
  {
    path: "/advisor/promotions/edit/:promotionId",
    element: <EditAdvisorBlogPromotionPage />,
  },
];
