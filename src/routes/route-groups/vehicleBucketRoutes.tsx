import { lazy } from "react";

const ManageVehicleBucketPage = lazy(
  () => import("../../pages/vehicle-bucket/ManageVehicleBucketPage"),
);
const AddVehicleBucketPage = lazy(
  () => import("../../pages/vehicle-bucket/AddVehicleBucketPage"),
);
const EditVehicleBucketPage = lazy(
  () => import("../../pages/vehicle-bucket/EditVehicleBucketPage"),
);

export const vehicleBucketRoutes = [
  {
    path: "/manage-vehicle-bucket",
    element: <ManageVehicleBucketPage />,
  },
  {
    path: "/manage-vehicle-bucket/add",
    element: <AddVehicleBucketPage />,
  },
  {
    path: "/manage-vehicle-bucket/edit/:vehicleBucketId",
    element: <EditVehicleBucketPage />,
  },
];
