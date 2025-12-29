# Quick Start Guide - Plan API Integration

## 🚀 Get Started in 3 Steps

### Step 1: Add Routes (Required)

Open `src/routes/routerConfig.tsx` and add these routes:

```tsx
// Import the pages
import { 
  ManagePlansPage, 
  AddPlanPage, 
  EditPlanPage, 
  ViewPlanPage 
} from '@/pages/plans';

// Add to your routes array
{
  path: '/plans',
  element: <ManagePlansPage />
},
{
  path: '/plans/add',
  element: <AddPlanPage />
},
{
  path: '/plans/edit/:id',
  element: <EditPlanPage />
},
{
  path: '/plans/view/:id',
  element: <ViewPlanPage />
}
```

### Step 2: Add Navigation Link (Optional)

Add a link to your sidebar or navigation menu:

```tsx
<Link to="/plans">Manage Plans</Link>
```

### Step 3: Access the Pages

Navigate to `http://localhost:3000/plans` (or your app URL) to start managing plans!

---

## 📖 Common Use Cases

### Display Plans for a Specific Company Tier

```tsx
import { usePlans, filterPlansByTier } from '@/hooks/usePlans';
import { CompanyTireType } from '@/types/planTypes';

function MyComponent({ companyTier = CompanyTireType.TIER_1 }) {
  const { plans, loading } = usePlans();
  const filteredPlans = filterPlansByTier(plans, companyTier);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {filteredPlans.map(plan => (
        <div key={plan.id}>
          <h3>{plan.planName}</h3>
          <p>${plan.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Use the Pre-built Component

```tsx
import PlansByTier from '@/components/PlansByTier';
import { usePlans } from '@/hooks/usePlans';
import { CompanyTireType } from '@/types/planTypes';

function SubscriptionPage() {
  const { plans } = usePlans();
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  return (
    <PlansByTier
      plans={plans}
      companyTireType={CompanyTireType.TIER_1}
      onSelectPlan={setSelectedPlan}
      selectedPlanId={selectedPlan?.id}
    />
  );
}
```

### Create a Plan Programmatically

```tsx
import { usePlanMutations } from '@/hooks/usePlans';

function CreatePlanButton() {
  const { createPlanMutation, loading } = usePlanMutations();
  
  const handleCreate = async () => {
    try {
      await createPlanMutation({
        planName: "Starter Plan",
        price: 29.99,
        tier: 0,
        tier1: true,
        tier2: false,
        tier3: false,
        isHidden: false
      });
      alert('Plan created!');
    } catch (error) {
      alert('Failed to create plan');
    }
  };
  
  return (
    <button onClick={handleCreate} disabled={loading}>
      Create Plan
    </button>
  );
}
```

---

## 🎯 Available Pages

### 1. Manage Plans (`/plans`)
- View all plans in a table
- Search by plan name
- Sort A-Z or Z-A
- Pagination support
- View, Edit, Delete actions

### 2. Add Plan (`/plans/add`)
- Create new plans
- Form validation
- Set price, tier, availability
- Hide/show option

### 3. Edit Plan (`/plans/edit/:id`)
- Modify existing plans
- Pre-filled form
- Update any field

### 4. View Plan (`/plans/view/:id`)
- Read-only details
- Formatted display
- All plan information

---

## 🔑 Key Concepts

### Company Tier Types
```typescript
CompanyTireType.TIER_1 = 0  // Tier 1 companies
CompanyTireType.TIER_2 = 1  // Tier 2 companies
CompanyTireType.TIER_3 = 2  // Tier 3 companies
```

### Plan Visibility
- `isHidden: false` - Plan is visible to public
- `isHidden: true` - Plan is hidden (admin only)

### Tier Availability
- `tier1: true` - Show to Tier 1 companies
- `tier2: true` - Show to Tier 2 companies
- `tier3: true` - Show to Tier 3 companies

---

## 📚 More Information

- **Full Documentation**: `PLAN_API_INTEGRATION.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **Code Examples**: `src/examples/planApiExamples.tsx`

---

## ⚡ That's It!

You're ready to use the Plan API integration. The system handles:
- ✅ Authentication automatically
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation
- ✅ Pagination
- ✅ Filtering by tier

Just navigate to `/plans` and start managing!
