// import { useAdminContext } from "@/context/AdminContext";
import { useLocation } from "react-router-dom";

type PathStatusMap = {
  [key: string]: {
    status: string;
    title: string;
  };
};

export default function AlertListingPageHeading() {
  const location = useLocation();
  // const { state } = useAdminContext();

  // Map paths to their corresponding statuses and titles
  const pathToStatus: PathStatusMap = {
    "/alert-updates/new-listing": { status: "UNDER_REVIEW", title: "New Listings" },
    "/alert-updates/updated-listing": { status: "UNDER_REVIEW", title: "Updated Listings" },
    "/alert-updates/pending-listing": { status: "REJECTED", title: "Pending Listings" },
  };

  // Get the current path and match it to a status/title
  const match = pathToStatus[location.pathname];

  // If no match is found, return null or a default header
  if (!match) {
    return null;
  }

  const { title } = match;

  return (
    <h2 className="text-3xl font-semibold max-sm:mb-4 max-sm:text-2xl">
      {title}
    </h2>
  );
}
