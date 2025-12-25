/**
 * Cache tags for Next.js fetch function. (for Nextjs / Admin React)
 * Used for tag based caching in nextjs + same tags used to trigger revalidation from admin panel
 */
export const CACHE_TAGS = {
  // home page
  HOMEPAGE_BANNER: "homepage-banner",
  FEATURED_VEHICLES: "featured-vehicles",
  HOMEPAGE_FAQ: "homepage-faq",

  // vehicle details page
  VEHICLE_DETAILS_FAQ: "vehicle-faq",
  SIMILAR_VEHICLES: "similar-vehicles",
  byVehicleCode: (vehicleCode: string) => vehicleCode,
} as const;
