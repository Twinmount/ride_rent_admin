// admin/src/helpers/price-offer-admin.ts

import { LiveListingVehicleType } from "@/types/api-types/vehicleAPI-types";

/**
 * Check if offer is active
 */
export function isOfferActive(vehicle: LiveListingVehicleType): boolean {
  if (!vehicle.priceOffer?.expiryTime) return false;
  return new Date(vehicle.priceOffer.expiryTime) > new Date();
}

/**
 * Get total time remaining until offer expires (admin view)
 * Shows actual remaining time, not cycle-based timer
 */
export function getOfferTimeRemaining(
  vehicle: LiveListingVehicleType,
): string | null {
  if (!vehicle.priceOffer?.expiryTime) return null;

  const now = new Date();
  const expiry = new Date(vehicle.priceOffer.expiryTime);
  const diffMs = expiry.getTime() - now.getTime();

  if (diffMs <= 0) return null;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Format display
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h left`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  } else {
    return `${minutes}m left`;
  }
}

/**
 * Get formatted start time
 */
export function getOfferStartTime(
  vehicle: LiveListingVehicleType,
): string | null {
  if (!vehicle.priceOffer?.startTime) return null;
  return new Date(vehicle.priceOffer.startTime).toLocaleString();
}

/**
 * Get formatted end time
 */
export function getOfferEndTime(
  vehicle: LiveListingVehicleType,
): string | null {
  if (!vehicle.priceOffer?.expiryTime) return null;
  return new Date(vehicle.priceOffer.expiryTime).toLocaleString();
}

/**
 * Get current cycle number and total cycles
 */
export function getOfferCycleInfo(vehicle: LiveListingVehicleType): {
  currentCycle: number;
  totalCycles: number;
  cycleText: string;
} | null {
  if (!vehicle.priceOffer) return null;

  const now = new Date();
  const start = new Date(vehicle.priceOffer.startTime);
  const expiry = new Date(vehicle.priceOffer.expiryTime);

  const elapsedMs = now.getTime() - start.getTime();
  const totalDurationMs = expiry.getTime() - start.getTime();
  const cycleDurationMs =
    vehicle.priceOffer.cycleDurationHours * 60 * 60 * 1000;

  const currentCycle = Math.min(
    Math.floor(elapsedMs / cycleDurationMs) + 1,
    Math.ceil(totalDurationMs / cycleDurationMs),
  );
  const totalCycles = Math.ceil(totalDurationMs / cycleDurationMs);

  return {
    currentCycle,
    totalCycles,
    cycleText: `Cycle ${currentCycle}/${totalCycles}`,
  };
}

/**
 * Get loop duration text
 */
export function getLoopDurationText(
  vehicle: LiveListingVehicleType,
): string | null {
  if (!vehicle.priceOffer?.cycleDurationHours) return null;
  const hours = vehicle.priceOffer.cycleDurationHours;
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

/**
 * Get complete offer summary for tooltip or expanded view
 */
export function getOfferSummary(vehicle: LiveListingVehicleType): {
  isActive: boolean;
  startTime: string;
  endTime: string;
  duration: string;
  loopDuration: string;
  currentCycle: string;
  timeRemaining: string;
} | null {
  if (!vehicle.priceOffer) return null;

  const active = isOfferActive(vehicle);
  const timeRemaining = getOfferTimeRemaining(vehicle);
  const cycleInfo = getOfferCycleInfo(vehicle);

  return {
    isActive: active,
    startTime: getOfferStartTime(vehicle) || "N/A",
    endTime: getOfferEndTime(vehicle) || "N/A",
    duration: `${vehicle.priceOffer.durationHours}h`,
    loopDuration: getLoopDurationText(vehicle) || "N/A",
    currentCycle: cycleInfo?.cycleText || "N/A",
    timeRemaining: timeRemaining || "Expired",
  };
}
