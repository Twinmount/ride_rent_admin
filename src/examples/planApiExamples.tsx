/**
 * Plan API Integration - Usage Examples
 * 
 * This file contains practical examples of using the Plan API integration
 */

import { usePlans, usePlan, usePlanMutations, filterPlansByTier } from '@/hooks/usePlans';
import { CompanyTireType, CreatePlanPayload } from '@/types/planTypes';

// ============================================================
// EXAMPLE 1: Fetching All Plans with Pagination
// ============================================================

export function Example1_FetchAllPlans() {
    const { plans, loading, error, pagination } = usePlans({
        page: 1,
        limit: 20,
        sortOrder: 'ASC'
    }); if (loading) return <div>Loading plans...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>All Plans</h2>
            <ul>
                {plans.map(plan => (
                    <li key={plan.id}>
                        {plan.planName} - ${plan.price}
                    </li>
                ))}
            </ul>
            <p>Page {pagination?.page} of {Math.ceil((pagination?.total || 0) / (pagination?.limit || 1))}</p>
        </div>
    );
}

// ============================================================
// EXAMPLE 2: Searching Plans
// ============================================================

export function Example2_SearchPlans() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const { plans, loading, fetchPlans } = usePlans();

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        fetchPlans({
            page: 1,
            limit: 10,
            search: value,
            sortOrder: 'ASC'
        });
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search plans..."
            />
            {loading ? (
                <p>Searching...</p>
            ) : (
                <ul>
                    {plans.map(plan => (
                        <li key={plan.id}>{plan.planName}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ============================================================
// EXAMPLE 3: Fetching a Single Plan
// ============================================================

export function Example3_SinglePlan({ planId }: { planId: string }) {
    const { plan, loading, error } = usePlan(planId);

    if (loading) return <div>Loading plan...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!plan) return <div>Plan not found</div>;

    return (
        <div>
            <h2>{plan.planName}</h2>
            <p>Price: ${plan.price}</p>
            <p>Tier: {plan.tier + 1}</p>
            <p>Status: {plan.isHidden ? 'Hidden' : 'Visible'}</p>
            <div>
                <strong>Available For:</strong>
                {plan.tier1 && <span> T1</span>}
                {plan.tier2 && <span> T2</span>}
                {plan.tier3 && <span> T3</span>}
            </div>
        </div>
    );
}

// ============================================================
// EXAMPLE 4: Creating a New Plan
// ============================================================

export function Example4_CreatePlan() {
    const { createPlanMutation, loading } = usePlanMutations();
    const { toast } = useToast();

    const handleCreatePlan = async () => {
        const newPlanData: CreatePlanPayload = {
            planName: "Premium Plus",
            price: 149.99,
            tier: 1, // Tier 2
            isHidden: false,
            tier1: false,
            tier2: true,
            tier3: true
        };

        try {
            const createdPlan = await createPlanMutation(newPlanData);
            toast({
                title: "Success",
                description: `Plan "${createdPlan?.planName}" created successfully!`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create plan",
                variant: "destructive"
            });
        }
    };

    return (
        <button onClick={handleCreatePlan} disabled={loading}>
            {loading ? 'Creating...' : 'Create Premium Plus Plan'}
        </button>
    );
}

// ============================================================
// EXAMPLE 5: Updating a Plan
// ============================================================

export function Example5_UpdatePlan({ planId }: { planId: string }) {
    const { updatePlanMutation, loading } = usePlanMutations();
    const { toast } = useToast();

    const handleUpdatePrice = async () => {
        try {
            await updatePlanMutation(planId, {
                price: 199.99 // Update only the price
            });
            toast({
                title: "Success",
                description: "Plan price updated!"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update plan",
                variant: "destructive"
            });
        }
    };

    return (
        <button onClick={handleUpdatePrice} disabled={loading}>
            {loading ? 'Updating...' : 'Update Price to $199.99'}
        </button>
    );
}

// ============================================================
// EXAMPLE 6: Deleting a Plan
// ============================================================

export function Example6_DeletePlan({ planId }: { planId: string }) {
    const { deletePlanMutation, loading } = usePlanMutations();
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this plan?')) return;

        try {
            await deletePlanMutation(planId);
            toast({
                title: "Success",
                description: "Plan deleted successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete plan",
                variant: "destructive"
            });
        }
    };

    return (
        <button onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Plan'}
        </button>
    );
}

// ============================================================
// EXAMPLE 7: Filtering Plans by Company Tier
// ============================================================

export function Example7_TierFilteredPlans({ companyTireType }: { companyTireType: CompanyTireType }) {
    const { plans, loading } = usePlans();

    // Filter plans for the specific company tier
    const filteredPlans = React.useMemo(
        () => filterPlansByTier(plans, companyTireType),
        [plans, companyTireType]
    );

    const getTierName = (tier: CompanyTireType) => {
        const names = ['Tier 1', 'Tier 2', 'Tier 3'];
        return names[tier] || 'Unknown';
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Plans for {getTierName(companyTireType)} Companies</h2>
            {filteredPlans.length === 0 ? (
                <p>No plans available for this tier</p>
            ) : (
                <ul>
                    {filteredPlans.map(plan => (
                        <li key={plan.id}>
                            {plan.planName} - ${plan.price}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ============================================================
// EXAMPLE 8: Using PlansByTier Component
// ============================================================

export function Example8_PlansByTierComponent() {
    const { plans, loading } = usePlans();
    const [selectedPlanId, setSelectedPlanId] = React.useState<string | undefined>();
    const [companyTier, setCompanyTier] = React.useState<CompanyTireType>(CompanyTireType.TIER_1);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div>
                <label>Select Company Tier:</label>
                <select
                    value={companyTier}
                    onChange={(e) => setCompanyTier(Number(e.target.value) as CompanyTireType)}
                >
                    <option value={CompanyTireType.TIER_1}>Tier 1</option>
                    <option value={CompanyTireType.TIER_2}>Tier 2</option>
                    <option value={CompanyTireType.TIER_3}>Tier 3</option>
                </select>
            </div>

            <PlansByTier
                plans={plans}
                companyTireType={companyTier}
                onSelectPlan={(plan) => setSelectedPlanId(plan.id)}
                selectedPlanId={selectedPlanId}
            />

            {selectedPlanId && (
                <div>
                    <p>Selected Plan ID: {selectedPlanId}</p>
                </div>
            )}
        </div>
    );
}

// ============================================================
// EXAMPLE 9: Filtering Visible Plans Only
// ============================================================

export function Example9_VisiblePlansOnly() {
    const { plans, loading } = usePlans();

    // Get only visible (not hidden) plans
    const visiblePlans = React.useMemo(
        () => plans.filter(plan => !plan.isHidden),
        [plans]
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Visible Plans ({visiblePlans.length})</h2>
            <ul>
                {visiblePlans.map(plan => (
                    <li key={plan.id}>{plan.planName}</li>
                ))}
            </ul>
        </div>
    );
}

// ============================================================
// EXAMPLE 10: Advanced - Plan Selection with Form
// ============================================================

export function Example10_PlanSelectionForm({ companyTireType }: { companyTireType: CompanyTireType }) {
    const { plans, loading } = usePlans();
    const [selectedPlanId, setSelectedPlanId] = React.useState<string>('');

    const availablePlans = React.useMemo(
        () => filterPlansByTier(plans, companyTireType),
        [plans, companyTireType]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedPlan = plans.find(p => p.id === selectedPlanId);
        console.log('Selected Plan:', selectedPlan);
        // Process the selected plan...
    };

    if (loading) return <div>Loading plans...</div>;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="plan-select">Choose a Plan:</label>
                <select
                    id="plan-select"
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    required
                >
                    <option value="">-- Select a Plan --</option>
                    {availablePlans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                            {plan.planName} - ${plan.price}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Subscribe to Plan</button>
        </form>
    );
}

// ============================================================
// EXAMPLE 11: Real-time Search with Debouncing
// ============================================================

export function Example11_DebouncedSearch() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [debouncedSearch, setDebouncedSearch] = React.useState('');
    const { plans, loading, fetchPlans } = usePlans();

    // Debounce search term
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch when debounced search changes
    React.useEffect(() => {
        fetchPlans({
            page: 1,
            limit: 10,
            search: debouncedSearch,
            sortOrder: 'ASC'
        });
    }, [debouncedSearch]);

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search plans..."
            />
            {loading && <span>Searching...</span>}
            <ul>
                {plans.map(plan => (
                    <li key={plan.id}>{plan.planName}</li>
                ))}
            </ul>
        </div>
    );
}

// ============================================================
// EXAMPLE 12: Bulk Operations
// ============================================================

export function Example12_BulkToggleVisibility() {
    const { plans, loading, refetch } = usePlans();
    const { updatePlanMutation } = usePlanMutations();
    const [isProcessing, setIsProcessing] = React.useState(false);

    const hideAllPlans = async () => {
        setIsProcessing(true);
        try {
            // Update all plans to hidden
            await Promise.all(
                plans.map(plan =>
                    updatePlanMutation(plan.id, { isHidden: true })
                )
            );
            await refetch(); // Refresh the list
            alert('All plans hidden successfully');
        } catch (error) {
            alert('Error hiding plans');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <button onClick={hideAllPlans} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Hide All Plans'}
            </button>
            <p>Total Plans: {plans.length}</p>
        </div>
    );
}

// Import React for examples
import * as React from 'react';
import { useToast } from '@/components/ui/use-toast';
import PlansByTier from '@/components/PlansByTier';
