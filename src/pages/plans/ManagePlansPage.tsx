import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlans, usePlanMutations } from "@/hooks/usePlans";
import { useToast } from "@/components/ui/use-toast";
import { Plan } from "@/types/planTypes";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/Pagination";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function ManagePlansPage() {
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<string | null>(null);

    // Debounce the search term
    const debouncedSearch = useDebouncedValue(search, 500);

    // Use TanStack Query - it will auto-refetch when params change
    const { data, isLoading } = usePlans({
        page,
        limit,
        search: debouncedSearch,
        sortOrder,
    });

    const plans = data?.plans || [];
    const pagination = data?.pagination || null;

    const { deletePlanMutation, loading: deleteLoading } = usePlanMutations();

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1); // Reset to first page on search
    };

    const handleSortChange = (value: "ASC" | "DESC") => {
        setSortOrder(value);
    };

    const handleLimitChange = (value: string) => {
        const newLimit = parseInt(value);
        setLimit(newLimit);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleDeleteClick = (planId: string) => {
        setPlanToDelete(planId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!planToDelete) return;

        try {
            await deletePlanMutation.mutateAsync(planToDelete);
            toast({
                title: "Success",
                description: "Plan deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete plan",
                variant: "destructive",
            });
        } finally {
            setDeleteDialogOpen(false);
            setPlanToDelete(null);
        }
    };

    const getTierBadges = (plan: Plan) => {
        const tiers: string[] = [];
        if (plan.T1) tiers.push("T1");
        if (plan.T2) tiers.push("T2");
        if (plan.T3) tiers.push("T3");
        return tiers;
    };

    // Get the lowest price from available tiers
    const getLowestPrice = (plan: Plan) => {
        const prices: number[] = [];
        if (plan.T1 && typeof plan.T1 === 'object') prices.push(plan.T1.subscriptionPrice);
        if (plan.T2 && typeof plan.T2 === 'object') prices.push(plan.T2.subscriptionPrice);
        if (plan.T3 && typeof plan.T3 === 'object') prices.push(plan.T3.subscriptionPrice);
        if (prices.length === 0) return null;
        return Math.min(...prices);
    };

    return (
        <section className="container h-auto min-h-screen pb-10">
            <div className="mb-8 mt-6">
                <h1 className="mb-4 text-center text-2xl font-bold sm:text-left">
                    Manage Plans
                </h1>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center gap-2">
                        <Input
                            placeholder="Search plans..."
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    {/* <div className="flex items-center gap-2">
                        <Select value={sortOrder} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ASC">A-Z</SelectItem>
                                <SelectItem value="DESC">Z-A</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={limit.toString()} onValueChange={handleLimitChange}>
                            <SelectTrigger className="w-24">
                                <SelectValue placeholder="Limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex-center min-h-[400px]">
                    <p className="text-lg text-gray-500">Loading plans...</p>
                </div>
            ) : plans.length > 0 ? (
                <>
                    <div className="overflow-x-auto rounded-lg border bg-white shadow">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Plan Name</TableHead>
                                    <TableHead>Starting Price</TableHead>
                                    <TableHead>Plan Type</TableHead>
                                    <TableHead>Available Tiers</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell className="font-medium">
                                            {plan.plan}
                                        </TableCell>
                                        <TableCell>
                                            {getLowestPrice(plan) !== null ? `₹${getLowestPrice(plan)}` : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {plan.planType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {getTierBadges(plan).map((tier) => (
                                                    <Badge key={tier} variant="secondary">
                                                        {tier}
                                                    </Badge>
                                                ))}
                                                {getTierBadges(plan).length === 0 && (
                                                    <span className="text-gray-500">None</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={plan.isHidden ? "destructive" : "default"}>
                                                {plan.isHidden ? "Hidden" : "Visible"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    asChild
                                                    title="View Plan"
                                                >
                                                    <Link to={`/plans/view/${plan.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    asChild
                                                    title="Edit Plan"
                                                >
                                                    <Link to={`/plans/edit/${plan.id}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDeleteClick(plan.id)}
                                                    disabled={deleteLoading}
                                                    title="Delete Plan"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {pagination && (
                        <div className="mt-6 flex justify-center">
                            <Pagination
                                page={pagination.page}
                                setPage={handlePageChange}
                                totalPages={pagination.totalNumberOfPages}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="mt-36 text-center text-2xl">No Plans Found!</div>
            )}

            {/* Add Button */}
            <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
                <Link
                    className="flex-center gap-x-1 bg-yellow px-3 py-2 text-white"
                    to="/plans/add"
                >
                    New Plan <Plus />
                </Link>
            </button>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the
                            plan from the system.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
