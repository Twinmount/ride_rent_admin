import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import Pagination from "@/components/Pagination";
import { API } from "@/api/ApiService";
import { useAdminContext } from "@/context/AdminContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";


export default function PriceMatchingPage() {
    const queryClient = useQueryClient();
    const PAGE_LIMIT = 50;
    const { state } = useAdminContext()
    const stateId = state.stateId;
    const [page, setPage] = useState(1);
    const [loadingIdx, setLoadingIdx] = useState<number | null>(null);

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
        placeholderData: (prev) => prev,
        enabled: !!stateId, // only run if stateId exists
    });

    const handleSendEmail = async (idx: number) => {
        if (!data?.list?.[idx]) return;
        const vehicleId = data.list[idx].vehicleId;
        setLoadingIdx(idx);
        try {
            await API.post({
                slug: `/vehicle/price-matching/send-mail/${vehicleId}`,
            });
            toast({
                title: `Reminder sent for ${data.list[idx].vehicleName}`,
                className: "bg-yellow text-white",
            });
            queryClient.invalidateQueries({
                queryKey: ["vehicle-price-matching", { stateId, page }],
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to send reminder.",
                description: "Something went wrong",
            });
        } finally {
            setLoadingIdx(null);
        }
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
                                    <TableCell className="py-3 px-4">
                                        {row.priceMatchEmailSendOn
                                            ? new Date(row.priceMatchEmailSendOn).toLocaleString()
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <button
                                            className="px-3 py-1 rounded bg-yellow text-white flex items-center justify-center min-w-[100px]"
                                            onClick={() => handleSendEmail(idx)}
                                            disabled={loadingIdx === idx}
                                        >
                                            {loadingIdx === idx ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                                                    Sending...
                                                </span>
                                            ) : (
                                                'Send Email'
                                            )}
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
