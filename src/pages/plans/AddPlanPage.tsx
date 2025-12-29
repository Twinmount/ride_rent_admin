import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePlanMutations } from "@/hooks/usePlans";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { PlanType } from "@/types/planTypes";

// Schema for tier details - all fields optional to allow flexible validation
const tierDetailsSchema = z.object({
    subscriptionPrice: z.coerce.number().min(0, "Must be 0 or greater"),
    individualBoostPrice: z.coerce.number().optional(),
    individualUnlockPrice: z.coerce.number().optional(),
    noOfBoost: z.coerce.number().min(0, "Must be 0 or greater"),
    noOfUnlock: z.coerce.number().min(0, "Must be 0 or greater"),
    title: z.string().min(1, "Required"),
    priceTitle: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    features: z.array(z.string().min(1, "Feature cannot be empty")).min(1, "At least one feature required"),
});

const planFormSchema = z.object({
    planType: z.nativeEnum(PlanType, { required_error: "Plan type is required" }),
    plan: z.string().min(1, "Plan name is required"),
    validityInDays: z.coerce.number().min(1, "Validity must be at least 1 day"),
    isHidden: z.boolean().default(false),
    enableT1: z.boolean().default(false),
    enableT2: z.boolean().default(false),
    enableT3: z.boolean().default(false),
    T1: tierDetailsSchema.optional(),
    T2: tierDetailsSchema.optional(),
    T3: tierDetailsSchema.optional(),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

const defaultListingTierDetails = {
    subscriptionPrice: 0,
    individualBoostPrice: 0,
    individualUnlockPrice: 0,
    noOfBoost: 0,
    noOfUnlock: 0,
    title: "",
    priceTitle: "",
    description: "",
    features: [""],
};

const defaultRechargeTierDetails = {
    subscriptionPrice: 0,
    noOfBoost: 0,
    noOfUnlock: 0,
    title: "",
    priceTitle: "",
    description: "",
    features: [""],
};

export default function AddPlanPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { createPlanMutation, loading } = usePlanMutations();
    const [enabledTiers, setEnabledTiers] = useState<{ T1: boolean; T2: boolean; T3: boolean }>({
        T1: false,
        T2: false,
        T3: false,
    });

    const form = useForm<PlanFormValues>({
        resolver: zodResolver(planFormSchema),
        defaultValues: {
            planType: PlanType.LISTING,
            plan: "",
            validityInDays: 30,
            isHidden: false,
            enableT1: false,
            enableT2: false,
            enableT3: false,
        },
    });

    const selectedPlanType = form.watch("planType");

    const onSubmit = async (values: PlanFormValues) => {
        try {
            const payload: any = {
                planType: values.planType,
                plan: values.plan,
                validityInDays: values.validityInDays,
                isHidden: values.isHidden,
                T1: values.enableT1 && values.T1 ? values.T1 : false,
                T2: values.enableT2 && values.T2 ? values.T2 : false,
                T3: values.enableT3 && values.T3 ? values.T3 : false,
            };

            await createPlanMutation.mutateAsync(payload);
            toast({
                title: "Success",
                description: "Plan created successfully",
            });
            navigate("/plans");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create plan. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleTierToggle = (tier: 'T1' | 'T2' | 'T3', enabled: boolean) => {
        setEnabledTiers(prev => ({ ...prev, [tier]: enabled }));
        // Update form value for enableT1/T2/T3
        const enableKey = `enable${tier}` as 'enableT1' | 'enableT2' | 'enableT3';
        form.setValue(enableKey, enabled);

        if (enabled) {
            const defaultDetails = selectedPlanType === PlanType.RECHARGE
                ? defaultRechargeTierDetails
                : defaultListingTierDetails;
            form.setValue(tier, defaultDetails as any);
        } else {
            form.setValue(tier, undefined);
        }
    };

    // Reset tier details when plan type changes
    const handlePlanTypeChange = (value: PlanType) => {
        form.setValue("planType", value);
        // Reset all tier details with new defaults based on plan type
        const defaultDetails = value === PlanType.RECHARGE
            ? defaultRechargeTierDetails
            : defaultListingTierDetails;

        if (enabledTiers.T1) form.setValue("T1", defaultDetails as any);
        if (enabledTiers.T2) form.setValue("T2", defaultDetails as any);
        if (enabledTiers.T3) form.setValue("T3", defaultDetails as any);
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
                <h1 className="text-center text-2xl font-bold sm:text-left">
                    Add New Plan
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Plan Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="planType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan Type</FormLabel>
                                        <Select
                                            onValueChange={(value) => handlePlanTypeChange(value as PlanType)}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select plan type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={PlanType.LISTING}>Listing Plan</SelectItem>
                                                <SelectItem value={PlanType.RECHARGE}>Recharge Plan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            {field.value === PlanType.LISTING
                                                ? "Listing plans include individual boost and unlock pricing"
                                                : "Recharge plans do not include individual boost and unlock pricing"}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="plan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Basic, Premium" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="validityInDays"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Validity (in Days)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="e.g., 30, 60, 90"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Number of days the plan will be valid after purchase
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isHidden"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Hide Plan</FormLabel>
                                            <FormDescription>
                                                Hidden plans won't be visible to public users
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Tier Sections */}
                    {(['T1', 'T2', 'T3'] as const).map((tier) => (
                        <TierSection
                            key={tier}
                            tier={tier}
                            form={form}
                            enabled={enabledTiers[tier]}
                            onToggle={(enabled) => handleTierToggle(tier, enabled)}
                            planType={selectedPlanType}
                        />
                    ))}

                    {/* Submit Buttons */}
                    <div className="flex gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? "Creating..." : "Create Plan"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/plans")}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </section>
    );
}

// Tier Section Component
function TierSection({
    tier,
    form,
    enabled,
    onToggle,
    planType,
}: {
    tier: 'T1' | 'T2' | 'T3';
    form: any;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    planType: PlanType;
}) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: `${tier}.features` as any,
    });

    const tierName = tier === 'T1' ? 'Tier 1' : tier === 'T2' ? 'Tier 2' : 'Tier 3';
    const isListingPlan = planType === PlanType.LISTING;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{tierName}</CardTitle>
                    <div className="flex items-center space-x-2">
                        <FormLabel htmlFor={`enable-${tier}`}>Enable {tierName}</FormLabel>
                        <Checkbox
                            id={`enable-${tier}`}
                            checked={enabled}
                            onCheckedChange={onToggle}
                        />
                    </div>
                </div>
            </CardHeader>
            {enabled && (
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={`${tier}.subscriptionPrice` as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subscription Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isListingPlan && (
                            <>
                                <FormField
                                    control={form.control}
                                    name={`${tier}.individualBoostPrice` as any}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Individual Boost Price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="200" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`${tier}.individualUnlockPrice` as any}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Individual Unlock Price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="100" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <FormField
                            control={form.control}
                            name={`${tier}.noOfBoost` as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of Boosts</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`${tier}.noOfUnlock` as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of Unlocks</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`${tier}.title` as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`${tier}.priceTitle` as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter price title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name={`${tier}.description` as any}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <FormLabel>Features</FormLabel>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append("")}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Feature
                            </Button>
                        </div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name={`${tier}.features.${index}` as any}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Enter feature" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
