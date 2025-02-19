export default function CompanyPageHeading({
  status,
}: {
  status: "APPROVED" | "PENDING" | "REJECTED" | "UNDER_REVIEW";
}) {
  const classes = "max-sm:text-2xl text-3xl font-semibold max-sm:mb-4";

  if (status === "APPROVED") {
    return <h2 className={classes}>Approved Companies</h2>;
  } else if (status === "PENDING") {
    return <h2 className={classes}>Pending Registrations</h2>;
  } else if (status === "REJECTED") {
    return <h2 className={classes}>Rejected Registrations</h2>;
  } else if (status === "UNDER_REVIEW") {
    return <h2 className={classes}>Under Review Registrations</h2>;
  }
}
