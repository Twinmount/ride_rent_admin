import { lazy } from "react";

const ManagePlansPage = lazy(() => import("../../pages/plans/ManagePlansPage"));
const AddPlanPage = lazy(() => import("../../pages/plans/AddPlanPage"));
const EditPlanPage = lazy(() => import("../../pages/plans/EditPlanPage"));
const ViewPlanPage = lazy(() => import("../../pages/plans/ViewPlanPage"));

export const plansRoutes = [
    // Plans routes
    {
        path: "/plans",
        element: <ManagePlansPage />,
    },
    {
        path: "/plans/add",
        element: <AddPlanPage />,
    },
    {
        path: "/plans/edit/:id",
        element: <EditPlanPage />,
    },
    {
        path: "/plans/view/:id",
        element: <ViewPlanPage />,
    },
];
