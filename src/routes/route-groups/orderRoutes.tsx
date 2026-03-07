import { lazy } from "react";

// Order details page
const OrderDetailsListingPage = lazy(
  () => import("../../pages/order/OrderListingPage"),
);

export const orderRoutes = [
  {
    path: "/orders/dashboard",
    element: (
      <OrderDetailsListingPage
        queryKey={["orders", "all-orders"]}
        title="All Orders"
      />
    ),
  },
];