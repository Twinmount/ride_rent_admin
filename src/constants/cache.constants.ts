/**
 * Cache tags for Next.js fetch function. (for Nextjs / Admin React)
 * Used for tag based caching in nextjs + same tags used to trigger revalidation from admin panel
 */
export const CACHE_TAGS = {
  // home page
  HOMEPAGE_BANNER: "homepage-banner",
  HOMEPAGE_FEATURED_VEHICLES: "featured-vehicles",
  HOMEPAGE_NEWLY_ARRIVED_VEHICLES: "newly-arrived-vehicles",
  HOMEPAGE_TOP_BRANDS: "homepage-top-brands",
  HOMEPAGE_FAQ: "homepage-faq",
  HOMEPAGE_PROMOTIONS: "homepage-promotions",

  // vehicle details page
  VEHICLE_DETAILS_FAQ: "vehicle-faq",
  VEHICLE_DETAILS_SIMILAR_VEHICLES: "similar-vehicles",
  byVehicleCode: (vehicleCode: string) => vehicleCode,
} as const;
