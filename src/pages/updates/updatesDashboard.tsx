import React from "react";
import {  Edit, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAdminContext } from "@/context/AdminContext";
import { VehicleStatusType } from "@/types/formTypes"; // Adjust import path if needed based on your project structure
import { fetchVehiclesWithStateAndLocation } from "@/api/listings/updatelistingApi";

const AlertDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAdminContext();

  const fetchCount = async (
    approvalStatus: VehicleStatusType,
    isModified?: boolean,
    newRegistration?: boolean
  ) => {
    if (!state.stateId) return 0;
    const data = await fetchVehiclesWithStateAndLocation({
      page: 1,
      limit: 1,
      sortOrder: "DESC" as const,
      isModified,
      approvalStatus,
      newRegistration,
      search: "",
      stateId: state.stateId as string,
    });
    // Assuming the API response includes `totalCount` in `result` (e.g., data.result.totalCount).
    // If not, adjust to `data.result.totalNumberOfPages * limit` for an approximation,
    // or implement a dedicated count API endpoint.
    return data?.result || 0;
  };

  const { data: newCount = 0 } = useQuery({
    queryKey: ["alerts", "counts", "new-listing", state],
    queryFn: () => fetchCount("UNDER_REVIEW", false, true),
    enabled: !!state.stateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: updatedCount = 0 } = useQuery({
    queryKey: ["alerts", "counts", "updated-listing", state],
    queryFn: () => fetchCount("UNDER_REVIEW", true),
    enabled: !!state.stateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: pendingCount = 0 } = useQuery({
    queryKey: ["alerts", "counts", "pending-listing", state],
    queryFn: () => fetchCount("PENDING", false, true),
    enabled: !!state.stateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleCategoryClick = (category: string) => {
    navigate(`/alert-updates/${category}`);
  };

  const categories = [
    { label: "New Listing", category: "new-listing", icon: Users, count: newCount },
    { label: "Updated Listing", category: "updated-listing", icon: Edit, count: updatedCount },
    { label: "Pending Listing", category: "pending-listing", icon: Clock, count: pendingCount },
  ];

  return (
    <section className="relative p-6 py-10 h-auto min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-2xl font-bold">Alert Dashboard</h2>
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ label, category, icon: Icon }) => (
            <div
              key={category}
              className="p-4 text-center bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCategoryClick(category)}
            >
              <Icon className="w-10 h-10 mx-auto text-[#FFB347]" />
              <p className="mt-4 text-lg font-semibold">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlertDashboard;