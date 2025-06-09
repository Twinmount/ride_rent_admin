import { useAdminContext } from "@/context/AdminContext";

export default function CompanyPageHeading({
  status,
}: {
  status: "APPROVED" | "PENDING" | "REJECTED" | "UNDER_REVIEW";
}) {
  const { country } = useAdminContext();

  const getTitle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Approved Companies";
      case "PENDING":
        return "Pending Registrations";
      case "REJECTED":
        return "Rejected Registrations";
      case "UNDER_REVIEW":
        return "Under Review Registrations";
      default:
        return "";
    }
  };

  const title = getTitle(status);

  return (
    <h2 className={`text-3xl font-semibold max-sm:mb-4 max-sm:text-2xl`}>
      {title} in {country.countryName}
    </h2>
  );
}
