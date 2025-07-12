import { lazy } from "react";

const Dashboard = lazy(() => import("../../pages/dashboard/Dashboard"));

export const dashboardRoutes = [
  // dashboard route
  { path: "/", element: <Dashboard /> },
];
