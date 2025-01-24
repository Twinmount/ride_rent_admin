export const searchSeries = async (
  brandId: string,
  searchTerm: string
): Promise<
  Array<{
    vehicleSeries: string;
    vehicleSeriesMetaTitle: string;
    vehicleSeriesMetaDescription: string;
  }>
> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mimicking random results with the same structure
      if (!brandId) {
        reject("Brand ID is required");
        return;
      }

      const mockResults = [
        {
          vehicleSeries: `abc-Series-A`,
          vehicleSeriesMetaTitle: `Meta Title for ABC Series A`,
          vehicleSeriesMetaDescription: `Meta Description for ABC Series A. Detailed information about the series.`,
        },
        {
          vehicleSeries: `EFG Series B`,
          vehicleSeriesMetaTitle: `Meta Title for EFG Series B`,
          vehicleSeriesMetaDescription: `Meta Description for EFG Series B. Comprehensive details about the series.`,
        },
        {
          vehicleSeries: `HIJ Series C`,
          vehicleSeriesMetaTitle: `Meta Title for HIJ Series C`,
          vehicleSeriesMetaDescription: `Meta Description for HIJ Series C. Specifications and features of this series.`,
        },
      ];

      // Return results matching the search term
      if (searchTerm) {
        resolve(mockResults);
      } else {
        resolve([]); // Return empty for no search term
      }
    }, 1000); // Mimics a 1-second API delay
  });
};
