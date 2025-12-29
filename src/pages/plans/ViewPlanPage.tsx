import { useNavigate, useParams } from "react-router-dom";
import { usePlan } from "@/hooks/usePlans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { PlanType, TierDetails, ListingTierDetails } from "@/types/planTypes";

export default function ViewPlanPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: plan, isLoading } = usePlan(id!);

    if (isLoading) {
        return (
            <section className="container h-auto min-h-screen pb-10">
                <div className="flex-center min-h-[400px]">
                    <p className="text-lg text-gray-500">Loading plan...</p>
                </div>
            </section>
        );
    }

    if (!plan) {
        return (
            <section className="container h-auto min-h-screen pb-10">
                <div className="flex-center min-h-[400px]">
                    <p className="text-lg text-gray-500">Plan not found</p>
                </div>
            </section>
        );
    }

    const isListingPlan = plan.planType === PlanType.LISTING;

    const renderTierDetails = (tier: TierDetails | false, tierName: string) => {
        if (!tier) return null;

        const tierData = tier as ListingTierDetails;

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{tierName} Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Subscription Price</p>
                            <p className="mt-1 text-lg font-semibold">₹{tierData.subscriptionPrice}</p>
                        </div>
                        {isListingPlan && 'individualBoostPrice' in tierData && (
                            <>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Individual Boost Price</p>
                                    <p className="mt-1 text-lg font-semibold">₹{tierData.individualBoostPrice}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Individual Unlock Price</p>
                                    <p className="mt-1 text-lg font-semibold">₹{tierData.individualUnlockPrice}</p>
                                </div>
                            </>
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-500">Number of Boosts</p>
                            <p className="mt-1 text-lg font-semibold">{tierData.noOfBoost}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Number of Unlocks</p>
                            <p className="mt-1 text-lg font-semibold">{tierData.noOfUnlock}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Title</p>
                            <p className="mt-1">{tierData.title}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Price Title</p>
                            <p className="mt-1">{tierData.priceTitle}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="mt-1 text-gray-700">{tierData.description}</p>
                    </div>

                    {tierData.features && tierData.features.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Features</p>
                            <ul className="list-disc list-inside space-y-1">
                                {tierData.features.map((feature, index) => (
                                    <li key={index} className="text-gray-700">{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <section className="container h-auto min-h-screen pb-10">
            <div className="mb-8 mt-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/plans")}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Plans
                </Button>
                <div className="flex items-center justify-between">
                    <h1 className="text-center text-2xl font-bold sm:text-left">
                        Plan Details
                    </h1>
                    <Button onClick={() => navigate(`/plans/edit/${id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Plan
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Basic Information Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{plan.plan}</CardTitle>
                            <div className="flex gap-2">
                                <Badge variant={isListingPlan ? "default" : "secondary"}>
                                    <Tag className="mr-1 h-3 w-3" />
                                    {isListingPlan ? "Listing Plan" : "Recharge Plan"}
                                </Badge>
                                <Badge variant={plan.isHidden ? "destructive" : "outline"}>
                                    {plan.isHidden ? "Hidden" : "Visible"}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Plan Type</p>
                                <p className="mt-1 text-lg font-semibold capitalize">
                                    {plan.planType || 'Listing'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Validity</p>
                                <p className="mt-1 text-lg font-semibold flex items-center">
                                    <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                                    {plan.validityInDays || 'N/A'} Days
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Created At</p>
                                <p className="mt-1 text-sm">
                                    {format(new Date(plan.createdAt), "PPP")}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Updated At</p>
                                <p className="mt-1 text-sm">
                                    {format(new Date(plan.updatedAt), "PPP")}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-4">
                            <p className="text-sm font-medium text-blue-900">Plan ID</p>
                            <p className="mt-1 font-mono text-xs text-blue-700">{plan.id}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Tier Details */}
                {renderTierDetails(plan.T1, "Tier 1")}
                {renderTierDetails(plan.T2, "Tier 2")}
                {renderTierDetails(plan.T3, "Tier 3")}

                {/* Show message if no tiers are configured */}
                {!plan.T1 && !plan.T2 && !plan.T3 && (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-gray-500">
                                No tier details configured for this plan.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
}
