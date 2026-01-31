import React from "react";
import { Users, Car, Box, Tag, Eye, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboard, fetchMostViewedVehicles } from "@/api/dashboard";

const Dashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: fetchAdminDashboard,
    staleTime: 10000,
  });

  const { data: mostViewedData, isLoading: isMostViewedLoading } = useQuery({
    queryKey: ["most-viewed-vehicles"],
    queryFn: () => fetchMostViewedVehicles(10),
    staleTime: 60000, // 1 minute
  });

  return (
    <section className="relative p-6 py-10 h-auto min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-2xl font-bold">Admin Dashboard</h2>

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 text-center bg-white rounded-lg shadow">
            <Users className="w-10 h-10 mx-auto text-[#FFB347]" />
            <p className="mt-4 text-lg font-semibold">Total Sellers</p>
            <p className="text-4xl font-bold text-[#FFB347] mt-2">
              {isLoading ? (
                <span className="text-lg">Loading...</span>
              ) : (
                data?.result.totalSellers
              )}
            </p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow">
            <Car className="w-10 h-10 mx-auto text-[#FFB347]" />
            <p className="mt-4 text-lg font-semibold">Total Vehicles</p>
            <p className="text-4xl font-bold text-[#FFB347] mt-2">
              {isLoading ? (
                <span className="text-lg">Loading...</span>
              ) : (
                data?.result.totalVehicles
              )}
            </p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow">
            <Box className="w-10 h-10 mx-auto text-[#FFB347]" />
            <p className="mt-4 text-lg font-semibold">Total Brands</p>
            <p className="text-4xl font-bold text-[#FFB347] mt-2">
              {isLoading ? (
                <span className="text-lg">Loading...</span>
              ) : (
                data?.result.totalBrands
              )}
            </p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow">
            <Tag className="w-10 h-10 mx-auto text-[#FFB347]" />
            <p className="mt-4 text-lg font-semibold">Total Categories</p>
            <p className="text-4xl font-bold text-[#FFB347] mt-2">
              {isLoading ? (
                <span className="text-lg">Loading...</span>
              ) : (
                data?.result.totalCategories
              )}
            </p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow">
            <Eye className="w-10 h-10 mx-auto text-[#FFB347]" />
            <p className="mt-4 text-lg font-semibold">Total Visits Today</p>
            <p className="text-4xl font-bold text-[#FFB347] mt-2">
              {isLoading ? (
                <span className="text-lg">Loading...</span>
              ) : (
                data?.result.totalVisits
              )}
            </p>
          </div>
        </div>

        {/* Most Viewed Vehicles Widget */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-[#FFB347]" />
            <h3 className="text-xl font-bold">Most Viewed Vehicles</h3>
          </div>
          
          {isMostViewedLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : mostViewedData?.result?.list && mostViewedData.result.list.length > 0 ? (
            <div className="space-y-3">
              {mostViewedData.result.list.slice(0, 10).map((vehicle: any, index: number) => (
                <div
                  key={vehicle.vehicleId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFB347] text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">{vehicle.vehicleModel}</p>
                      <p className="text-sm text-gray-500">{vehicle.vehicleCode}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No view data available yet
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
