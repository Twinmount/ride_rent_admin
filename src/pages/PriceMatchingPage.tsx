import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import Pagination from "@/components/Pagination";
import { API } from "@/api/ApiService";
import { useAdminContext } from "@/context/AdminContext";
import { useQuery } from "@tanstack/react-query";


export default function PriceMatchingPage() {
    const PAGE_LIMIT = 50;
    const { state } = useAdminContext()
    const stateId = state.stateId;
    const [page, setPage] = useState(1);

    const fetchVehiclePriceMatching = async ({ queryKey }: any) => {
        const [_key, { stateId, page }] = queryKey;
        const res = await API.get<any>({
            slug: "/vehicle/price-matching/paginated",
            queryParameters: { stateId, page, limit: PAGE_LIMIT },
        });
        return res?.result || { list: [], page: 1, limit: PAGE_LIMIT, total: 0, totalNumberOfPages: 1 };
    };

    const {
        data,
        isLoading,
        // isError,
        // error,
        // refetch,
        // isFetching,
    } = useQuery({
        queryKey: ["vehicle-price-matching", { stateId, page }],
        queryFn: fetchVehiclePriceMatching,
        keepPreviousData: true, // keeps old page data while fetching new one
        enabled: !!stateId, // only run if stateId exists
    });

    const handleSendEmail = (idx: number) => {
        // Simulate sending email
        // TODO: Replace with actual API call
        alert(`Reminder sent for ${data.list[idx].vehicleName}`);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Price Alert</h1>
            <div className="overflow-x-auto">
                <Table className="min-w-full border rounded-lg bg-white shadow">
                    <TableHeader>
                        <TableRow className="bg-gray-100 text-gray-700">
                            <TableHead className="py-3 px-4 text-left">Vehicle Details</TableHead>
                            <TableHead className="py-3 px-4 text-left">Hourly Price</TableHead>
                            <TableHead className="py-3 px-4 text-left">Daily Price</TableHead>
                            <TableHead className="py-3 px-4 text-left">Weekly Price</TableHead>
                            <TableHead className="py-3 px-4 text-left">Monthly Price</TableHead>
                            <TableHead className="py-3 px-4 text-left">Last Reminder Sent On</TableHead>
                            <TableHead className="py-3 px-4 text-left">Send Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : data?.list?.length ? (
                            data.list.map((row: any, idx: number) => (
                                // ...existing code...
                                <TableRow key={row.vehicleCode} className="border-b hover:bg-yellow-50 transition">
                                    <TableCell className="py-3 px-4">
                                        <div className={`flex flex-col gap-1`}>
                                            <span className="font-semibold">{row.vehicleName}</span>
                                            <span className="text-xs text-gray-500">{row.vehicleCode}</span>
                                            <a className="text-xs cursor-pointer underline text-blue-700" href={`/listings/edit/${row?.vehicleId}/${row?.companyId}/${row?.userId}`} target="blank">view vehicle form</a>
                                            {row?.seriesId && <a className="text-xs cursor-pointer underline text-blue-700" href={`/manage-series/edit/${row?.seriesId}?tab=price`} target="blank">view vehicle series price</a>}
                                        </div>
                                    </TableCell>
                                    {/* <TableCell className="py-3 px-4">{row.vehicleCode}</TableCell> */}
                                    < TableCell className={`py-3 px-4 ${row.hourly?.high ? 'bg-red-600 text-white' : ''}`}>
                                        <div className={`flex flex-col gap-1 ${row.hourly?.high ? 'text-white' : ''}`}>
                                            <span className={`text-xs ${row.hourly?.high ? 'text-white' : 'text-gray-500'}`}>Current:&nbsp;<span className={`font-semibold ${row.hourly?.high ? 'text-white' : 'text-gray-700'}`}>{row.hourly?.current ?? '-'}</span></span>
                                            <span className={`text-xs ${row.hourly?.high ? 'text-white' : 'text-gray-500'}`}>Avg:&nbsp;<span className={`font-semibold ${row.hourly?.high ? 'text-white' : 'text-gray-700'}`}>{row.hourly?.avg ?? '-'}</span></span>
                                            {typeof row.hourly?.assigned !== 'undefined' && (
                                                <span className={`text-xs ${row.hourly?.high ? 'text-white' : 'text-gray-500'}`}>Assigned:&nbsp;<span className={`font-semibold px-2 py-1 rounded ${row.hourly?.high ? 'text-white' : 'bg-yellow-100 text-yellow-700'}`}>{row.hourly?.assigned}</span></span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className={`py-3 px-4 ${row.daily?.high ? 'bg-red-600 text-white' : ''}`}>
                                        <div className={`flex flex-col gap-1 ${row.daily?.high ? 'text-white' : ''}`}>
                                            <span className={`text-xs ${row.daily?.high ? 'text-white' : 'text-gray-500'}`}>Current:&nbsp;<span className={`font-semibold ${row.daily?.high ? 'text-white' : 'text-gray-700'}`}>{row.daily?.current ?? '-'}</span></span>
                                            <span className={`text-xs ${row.daily?.high ? 'text-white' : 'text-gray-500'}`}>Avg:&nbsp;<span className={`font-semibold ${row.daily?.high ? 'text-white' : 'text-gray-700'}`}>{row.daily?.avg ?? '-'}</span></span>
                                            {typeof row.daily?.assigned !== 'undefined' && (
                                                <span className={`text-xs ${row.daily?.high ? 'text-white' : 'text-gray-500'}`}>Assigned:&nbsp;<span className={`font-semibold px-2 py-1 rounded ${row.daily?.high ? 'text-white' : 'bg-yellow-100 text-yellow-700'}`}>{row.daily?.assigned}</span></span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className={`py-3 px-4 ${row.weekly?.high ? 'bg-red-600 text-white' : ''}`}>
                                        <div className={`flex flex-col gap-1 ${row.weekly?.high ? 'text-white' : ''}`}>
                                            <span className={`text-xs ${row.weekly?.high ? 'text-white' : 'text-gray-500'}`}>Current:&nbsp;<span className={`font-semibold ${row.weekly?.high ? 'text-white' : 'text-gray-700'}`}>{row.weekly?.current ?? '-'}</span></span>
                                            <span className={`text-xs ${row.weekly?.high ? 'text-white' : 'text-gray-500'}`}>Avg:&nbsp;<span className={`font-semibold ${row.weekly?.high ? 'text-white' : 'text-gray-700'}`}>{row.weekly?.avg ?? '-'}</span></span>
                                            {typeof row.weekly?.assigned !== 'undefined' && (
                                                <span className={`text-xs ${row.weekly?.high ? 'text-white' : 'text-gray-500'}`}>Assigned:&nbsp;<span className={`font-semibold px-2 py-1 rounded ${row.weekly?.high ? 'text-white' : 'bg-yellow-100 text-yellow-700'}`}>{row.weekly?.assigned}</span></span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className={`py-3 px-4 ${row.monthly?.high ? 'bg-red-600 text-white' : ''}`}>
                                        <div className={`flex flex-col gap-1 ${row.monthly?.high ? 'text-white' : ''}`}>
                                            <span className={`text-xs ${row.monthly?.high ? 'text-white' : 'text-gray-500'}`}>Current:&nbsp;<span className={`font-semibold ${row.monthly?.high ? 'text-white' : 'text-gray-700'}`}>{row.monthly?.current ?? '-'}</span></span>
                                            <span className={`text-xs ${row.monthly?.high ? 'text-white' : 'text-gray-500'}`}>Avg:&nbsp;<span className={`font-semibold ${row.monthly?.high ? 'text-white' : 'text-gray-700'}`}>{row.monthly?.avg ?? '-'}</span></span>
                                            {typeof row.monthly?.assigned !== 'undefined' && (
                                                <span className={`text-xs ${row.monthly?.high ? 'text-white' : 'text-gray-500'}`}>Assigned:&nbsp;<span className={`font-semibold px-2 py-1 rounded ${row.monthly?.high ? 'text-white' : 'bg-yellow-100 text-yellow-700'}`}>{row.monthly?.assigned}</span></span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 px-4">{row.lastReminder}</TableCell>
                                    <TableCell className="py-3 px-4">
                                        <button
                                            className="px-3 py-1 rounded bg-yellow text-white"
                                            onClick={() => handleSendEmail(idx)}
                                        >
                                            Send&nbsp;Email
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">No data found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div >
            <Pagination
                page={page}
                setPage={setPage}
                totalPages={data?.totalNumberOfPages || 1}
            />
        </div >
    );
}
