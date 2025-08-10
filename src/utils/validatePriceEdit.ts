import { API } from "@/api/ApiService";

export async function validatePriceEdit(vehicleSeriesId: string, year: string): Promise<{ ok: boolean }> {
  // Replace with actual API endpoint and logic
  try {
    const response: any = await API.get<{ ok: boolean }>({ slug: `/vehicle/has-prices/${vehicleSeriesId}/${year}` });
    return { ok: response?.result?.hasPrices ?? true };
  } catch (error) {
    return { ok: true };
  }
}
