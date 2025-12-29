# Plan API Integration - React Frontend

This documentation provides a complete guide for the Plan API integration in the React admin frontend.

## 📁 File Structure

```
src/
├── api/
│   └── plans/
│       ├── planApi.ts       # API service functions
│       └── index.ts         # Export barrel file
├── types/
│   └── planTypes.ts         # TypeScript interfaces and types
├── hooks/
│   └── usePlans.tsx         # Custom React hooks for plans
├── pages/
│   └── plans/
│       ├── ManagePlansPage.tsx   # List all plans
│       ├── AddPlanPage.tsx       # Create new plan
│       ├── EditPlanPage.tsx      # Edit existing plan
│       ├── ViewPlanPage.tsx      # View plan details
│       └── index.ts              # Export barrel file
└── components/
    └── PlansByTier.tsx      # Component to display filtered plans
```

## 🔌 API Endpoints

### 1. Get All Plans (Public)
- **URL:** `/plans`
- **Method:** GET
- **Auth Required:** No
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search by plan name
  - `sortOrder`: 'ASC' | 'DESC'

### 2. Get Single Plan (Public)
- **URL:** `/plans/:id`
- **Method:** GET
- **Auth Required:** No

### 3. Create Plan (Admin/Seller Only)
- **URL:** `/plans`
- **Method:** POST
- **Auth Required:** Yes
- **Body:** Plan data (see CreatePlanPayload type)

### 4. Update Plan (Admin/Seller Only)
- **URL:** `/plans/:id`
- **Method:** PUT
- **Auth Required:** Yes
- **Body:** Updated plan data

### 5. Delete Plan (Admin/Seller Only)
- **URL:** `/plans/:id`
- **Method:** DELETE
- **Auth Required:** Yes

## 📝 TypeScript Types

### Core Types

```typescript
// Company Tier Type Enum
enum CompanyTireType {
  TIER_1 = 0,
  TIER_2 = 1,
  TIER_3 = 2,
}

// Plan Interface
interface Plan {
  id: string;
  planName: string;
  price: number;
  tier: number;
  isHidden: boolean;
  tier1: boolean;
  tier2: boolean;
  tier3: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🎣 Custom Hooks

### `usePlans(initialParams)`
Fetch and manage list of plans with pagination

```typescript
const { plans, loading, error, pagination, fetchPlans, refetch } = usePlans({
  page: 1,
  limit: 10,
  search: '',
  sortOrder: 'ASC'
});
```

### `usePlan(planId)`
Fetch a single plan by ID

```typescript
const { plan, loading, error, fetchPlan } = usePlan(planId);
```

### `usePlanMutations()`
Perform create, update, delete operations (requires auth)

```typescript
const { createPlanMutation, updatePlanMutation, deletePlanMutation, loading, error } = usePlanMutations();
```

## 🎨 Components

### ManagePlansPage
Main page to list all plans with filtering, sorting, and CRUD operations.

**Features:**
- Search plans by name
- Sort A-Z or Z-A
- Pagination
- View, Edit, Delete actions
- Shows tier availability badges
- Hidden/Visible status

### AddPlanPage
Form to create a new plan with validation.

**Fields:**
- Plan Name (required)
- Price (required, min: 0)
- Primary Tier (0-2)
- Available for Tier 1/2/3 (checkboxes)
- Hide Plan (checkbox)

### EditPlanPage
Form to edit an existing plan.

### ViewPlanPage
Read-only view of plan details with formatted display.

### PlansByTier Component
Reusable component to display plans filtered by company tier type.

```tsx
<PlansByTier
  plans={plans}
  companyTireType={CompanyTireType.TIER_1}
  onSelectPlan={(plan) => console.log(plan)}
  selectedPlanId={selectedId}
/>
```

## 🔐 Authentication

- **Public Access:** List and view plans (no auth required)
- **Protected Operations:** Create, update, delete (requires Admin/Seller role)
- Authorization token is automatically added by ApiService interceptor

## 🎯 Tier-Based Filtering

Plans are filtered based on the company's `companyTireType`:

```typescript
// Filter plans for a specific tier
const filteredPlans = filterPlansByTier(plans, CompanyTireType.TIER_1);

// Logic:
// - Filters out hidden plans (isHidden: true)
// - Shows only plans where the relevant tier field is true
//   - Tier 1: plan.tier1 === true
//   - Tier 2: plan.tier2 === true
//   - Tier 3: plan.tier3 === true
```

## 📋 Usage Examples

### Fetching Plans

```typescript
import { usePlans } from '@/hooks/usePlans';

function MyComponent() {
  const { plans, loading, fetchPlans } = usePlans({
    page: 1,
    limit: 20,
    sortOrder: 'ASC'
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {plans.map(plan => (
        <div key={plan.id}>{plan.planName}</div>
      ))}
    </div>
  );
}
```

### Creating a Plan

```typescript
import { usePlanMutations } from '@/hooks/usePlans';

function CreatePlan() {
  const { createPlanMutation, loading } = usePlanMutations();

  const handleCreate = async () => {
    try {
      const newPlan = await createPlanMutation({
        planName: "Premium Plan",
        price: 99.99,
        tier: 0,
        isHidden: false,
        tier1: true,
        tier2: true,
        tier3: false
      });
      console.log('Created:', newPlan);
    } catch (error) {
      console.error('Failed to create plan');
    }
  };

  return <button onClick={handleCreate}>Create Plan</button>;
}
```

### Filtering by Company Tier

```typescript
import { filterPlansByTier } from '@/hooks/usePlans';
import { CompanyTireType } from '@/types/planTypes';

// Get plans for Tier 1 companies only
const tier1Plans = filterPlansByTier(allPlans, CompanyTireType.TIER_1);

// Get only visible plans
const visiblePlans = allPlans.filter(plan => !plan.isHidden);
```

## 🚀 Adding Routes

Add these routes to your router configuration:

```tsx
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

## ⚙️ API Configuration

The API base URL is configured in `src/api/Api-config.ts`. The Plan endpoints are added to `src/api/Api-Endpoints.ts`:

```typescript
export enum Slug {
  // ...other endpoints
  GET_ALL_PLANS = "/plans",
  GET_PLAN = "/plans",
  POST_PLAN = "/plans",
  PUT_PLAN = "/plans",
  DELETE_PLAN = "/plans",
}
```

## 🎨 UI Components Used

- **shadcn/ui components:**
  - Button
  - Input
  - Select
  - Table
  - Card
  - Badge
  - Checkbox
  - Form
  - AlertDialog
  - Pagination

## 🔄 State Management

The integration uses:
- React hooks for local state
- Custom hooks for data fetching
- No global state management required

## ⚠️ Error Handling

All API functions include try-catch blocks and proper error propagation:

```typescript
try {
  const plans = await getAllPlans(params);
} catch (error) {
  // Error is logged and re-thrown
  // Handle in component with toast notifications
}
```

## 📊 Pagination

Pagination is handled automatically:

```typescript
const { pagination } = usePlans({ page: 1, limit: 10 });

// pagination object contains:
// {
//   page: 1,
//   limit: 10,
//   total: 100
// }
```

## 🔍 Search & Filtering

Search by plan name:

```typescript
fetchPlans({ search: 'premium', page: 1, limit: 10 });
```

Sort results:

```typescript
fetchPlans({ sortOrder: 'ASC' }); // or 'DESC'
```

## 💡 Best Practices

1. **Always check loading state** before rendering data
2. **Use error boundaries** for graceful error handling
3. **Implement optimistic updates** for better UX
4. **Cache API responses** when appropriate
5. **Validate forms** before submission
6. **Show loading indicators** during async operations
7. **Display toast notifications** for user feedback

## 🐛 Debugging

Enable console logs in API functions to debug:
- Check browser Network tab for API calls
- Verify authentication tokens in request headers
- Check response status codes and error messages

## 📦 Dependencies

Required packages:
- `axios` - HTTP client
- `react-router-dom` - Routing
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@hookform/resolvers` - Form resolver
- `@radix-ui/*` - UI primitives
- `lucide-react` - Icons
- `date-fns` - Date formatting

## 🎯 Key Features

✅ Full CRUD operations for plans  
✅ Tier-based filtering system  
✅ Public and protected endpoints  
✅ Comprehensive TypeScript types  
✅ Reusable custom hooks  
✅ Form validation with Zod  
✅ Responsive UI components  
✅ Error handling and loading states  
✅ Search and pagination  
✅ Sort functionality  

## 📞 Support

For issues or questions, check:
- API documentation
- Component source code
- Console error logs
- Network tab in DevTools
