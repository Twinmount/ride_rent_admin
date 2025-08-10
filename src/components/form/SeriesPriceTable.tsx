
import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import PriceEditModal from "./PriceEditModal";
import { useQuery } from "@tanstack/react-query";
import { fetchRentalAverages } from "@/api/vehicle-series";
import { API } from "@/api/ApiService";
async function saveRentalPricesApi(vehicleSeriesId: string, year: string, prices: { hourly: number; daily: number; week: number; monthly: number }) {
  await API.post({
    slug: `/vehicle/series/${vehicleSeriesId}/rental-averages`,
    body: { year, ...prices },
  });
}
import { useParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";

export default function SeriesPriceTable() {
  const { vehicleSeriesId } = useParams<{ vehicleSeriesId: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<number | null>(null);
  // removed unused editData state

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle-series-rental-averages", vehicleSeriesId],
    queryFn: () => fetchRentalAverages(vehicleSeriesId as string),
    enabled: !!vehicleSeriesId,
  });

  // keep local state for editing assigned prices
  const [tableData, setTableData] = useState<any[]>([]);

  // update tableData when api data changes (support both nested and flat structure)
  useEffect(() => {
    if (Array.isArray(data?.result)) {
      setTableData(data.result);
    } else if (data?.result?.data && Array.isArray(data.result.data)) {
      setTableData(data.result.data);
    }
  }, [data]);

  const handleEdit = (idx: number) => {
    setEditRow(idx);
    setModalOpen(true);
  };

  const handleSave = async (prices: { hourly: number; daily: number; week: number; monthly: number }) => {
    if (editRow !== null && vehicleSeriesId) {
      const year = tableData[editRow].year;
      // Call the API to save prices
      await saveRentalPricesApi(vehicleSeriesId, year, prices);
      setTableData(prev => prev.map((row, idx) => idx === editRow ? {
        ...row,
        hourly: { ...row.hourly, assigned: prices.hourly },
        daily: { ...row.daily, assigned: prices.daily },
        week: { ...row.week, assigned: prices.week },
        monthly: { ...row.monthly, assigned: prices.monthly },
      } : row));
    }
  };

  if (isLoading) {
    return <FormSkelton />;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
      <Table className="border rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-700">
            <TableCell className="font-semibold py-3 px-4">Year</TableCell>
            <TableCell className="font-semibold py-3 px-4">Hourly Price</TableCell>
            <TableCell className="font-semibold py-3 px-4">Daily Price</TableCell>
            <TableCell className="font-semibold py-3 px-4">Weekly Price</TableCell>
            <TableCell className="font-semibold py-3 px-4">Monthly Price</TableCell>
            <TableCell className="font-semibold py-3 px-4">Edit</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, idx) => (
            <TableRow key={row.year} className="border-b hover:bg-yellow-50 transition">
              <TableCell className="py-3 px-4 text-center text-base font-medium">{row.year}</TableCell>
              <TableCell className="py-3 px-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Avg: <span className="font-semibold text-gray-700">{row.hourly.avg}</span></span>
                  <span className="text-xs text-gray-500">Assigned: <span className="font-semibold text-yellow-600">{row.hourly.assigned}</span></span>
                </div>
              </TableCell>
              <TableCell className="py-3 px-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Avg: <span className="font-semibold text-gray-700">{row.daily.avg}</span></span>
                  <span className="text-xs text-gray-500">Assigned: <span className="font-semibold text-yellow-600">{row.daily.assigned}</span></span>
                </div>
              </TableCell>
              <TableCell className="py-3 px-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Avg: <span className="font-semibold text-gray-700">{row.week.avg}</span></span>
                  <span className="text-xs text-gray-500">Assigned: <span className="font-semibold text-yellow-600">{row.week.assigned}</span></span>
                </div>
              </TableCell>
              <TableCell className="py-3 px-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Avg: <span className="font-semibold text-gray-700">{row.monthly.avg}</span></span>
                  <span className="text-xs text-gray-500">Assigned: <span className="font-semibold text-yellow-600">{row.monthly.assigned}</span></span>
                </div>
              </TableCell>
              <TableCell className="py-3 px-4 text-center">
                <button
                  className="px-4 py-1.5 rounded-lg bg-yellow text-white font-semibold shadow hover:bg-yellow-600 transition"
                  onClick={() => handleEdit(idx)}
                >
                  Edit
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editRow !== null && (
        <PriceEditModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditRow(null); }}
          year={tableData[editRow].year}
          prices={{
            hourly: tableData[editRow].hourly.assigned,
            daily: tableData[editRow].daily.assigned,
            week: tableData[editRow].week.assigned,
            monthly: tableData[editRow].monthly.assigned,
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
