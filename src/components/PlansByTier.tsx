import { useMemo } from "react";
import { Plan, CompanyTireType } from "@/types/planTypes";
import { filterPlansByTier } from "@/hooks/usePlans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PlansByTierProps {
    plans: Plan[];
    companyTireType: CompanyTireType;
    onSelectPlan?: (plan: Plan) => void;
    selectedPlanId?: string;
}

/**
 * Component to display plans filtered by company tier type
 * Only shows visible plans that are enabled for the specific tier
 */
export default function PlansByTier({
    plans,
    companyTireType,
    onSelectPlan,
    selectedPlanId,
}: PlansByTierProps) {
    const filteredPlans = useMemo(
        () => filterPlansByTier(plans, companyTireType),
        [plans, companyTireType]
    );

    const getTierName = (tier: CompanyTireType): string => {
        switch (tier) {
            case CompanyTireType.TIER_1:
                return "Tier 1";
            case CompanyTireType.TIER_2:
                return "Tier 2";
            case CompanyTireType.TIER_3:
                return "Tier 3";
            default:
                return "Unknown";
        }
    };

    if (filteredPlans.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-gray-500">
                    No plans available for {getTierName(companyTireType)} companies
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    Available Plans for {getTierName(companyTireType)}
                </h3>
                <Badge variant="secondary">{filteredPlans.length} Plans</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`transition-all hover:shadow-md ${selectedPlanId === plan.id ? "border-yellow ring-2 ring-yellow" : ""
                            }`}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-lg">
                                {plan.planName}
                                <Badge variant="outline">Tier {plan.tier + 1}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="text-2xl font-bold">${plan.price}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Available For:</p>
                                <div className="mt-1 flex gap-1">
                                    {plan.tier1 && (
                                        <Badge variant="secondary" className="text-xs">
                                            T1
                                        </Badge>
                                    )}
                                    {plan.tier2 && (
                                        <Badge variant="secondary" className="text-xs">
                                            T2
                                        </Badge>
                                    )}
                                    {plan.tier3 && (
                                        <Badge variant="secondary" className="text-xs">
                                            T3
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {onSelectPlan && (
                                <Button
                                    className="w-full"
                                    variant={selectedPlanId === plan.id ? "default" : "outline"}
                                    onClick={() => onSelectPlan(plan)}
                                >
                                    {selectedPlanId === plan.id ? "Selected" : "Select Plan"}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
