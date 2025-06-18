import { lazy } from "react";

const JobsListPage = lazy(() => import("../../pages/careers/JobsListPage"));

const ApplicationListPage = lazy(
  () => import("../../pages/careers/ApplicationListPage"),
);

const CreateNewJobPage = lazy(
  () => import("../../pages/careers/CreateNewJobPage"),
);

const EditJobPage = lazy(() => import("../../pages/careers/EditJobPage"));

export const careersRoutes = [
  // Careers routes

  {
    path: "/careers/applications",
    element: <ApplicationListPage />,
  },
  {
    path: "/careers/jobs",
    element: <JobsListPage />,
  },
  {
    path: "/careers/jobs/add",
    element: <CreateNewJobPage />,
  },
  {
    path: "/careers/jobs/edit",
    element: <EditJobPage />,
  },
];
