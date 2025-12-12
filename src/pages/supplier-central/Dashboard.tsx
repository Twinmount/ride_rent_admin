import React from "react";
import { Users, Check, X, Pause, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSupplierCentralDashboard } from "@/api/supplier-central";
import { useNavigate } from "react-router-dom";

const SupplierCentralDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["supplier-central-dashboard"],
    queryFn: fetchSupplierCentralDashboard,
    staleTime: 10000,
  });
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/suppliercentral/category/${category}`);
  };

  const categories = [
    { label: "Total Suppliers", value: data?.result?.totalSuppliers || 0, category: "total-suppliers", icon: Users },
    { label: "Subscribed", value: data?.result?.subscribed || 0, category: "subscribed", icon: Check },
    { label: "Missed Subscriptions", value: data?.result?.missedSubscriptions || 0, category: "missed-subscriptions", icon: X },
    { label: "Inactive", value: data?.result?.inactive || 0, category: "inactive", icon: Pause },
    { label: "Order Missed", value: data?.result?.orderMissed || 0, category: "order-missed", icon: AlertTriangle },
  ];

  return (
    <section className="relative p-6 py-10 h-auto min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-2xl font-bold">Supplier Central Dashboard</h2>

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ label, value, category, icon: Icon }) => (
            <div
              key={category}
              className="p-4 text-center bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCategoryClick(category)}
            >
              <Icon className="w-10 h-10 mx-auto text-[#FFB347]" />
              <p className="mt-4 text-lg font-semibold">{label}</p>
              <p className="text-4xl font-bold text-[#FFB347] mt-2">
                {isLoading ? (
                  <span className="text-lg">Loading...</span>
                ) : (
                  value
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupplierCentralDashboard;