import { Link } from "react-router-dom";
import GridSkelton from "@/components/skelton/GridSkelton";
import { BrandType } from "@/types/api-types/API-types";
import { useFetchSeries } from "@/pages/manage-series/SeriesPage.hooks";

type SeriesListProps = {
  stateId: string;
  search: string;
  brand: BrandType | null;
  page: number;
};

export const SeriesList: React.FC<SeriesListProps> = ({
  stateId,
  search,
  brand,
  page = 1,
}) => {
  const baseAssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const { seriesList, isLoading } = useFetchSeries({
    stateId,
    searchTerm: search,
    vehicleBrandId: brand?.id,
    page,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 place-items-center gap-2 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        <GridSkelton type="brand" />
      </div>
    );
  }

  if (seriesList.length === 0) {
    return <NoSeriesFound search={search || ""} />;
  }

  return (
    <div className="mt-6 grid grid-cols-2 place-items-center gap-2 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {seriesList.map((data) => (
        <Link
          to={`/manage-series/edit/${data.vehicleSeriesId}`}
          key={data.vehicleSeriesId}
          className="h-36 w-full min-w-32 rounded-xl border bg-white"
        >
          <div className="max-w-full text-center text-sm font-semibold">
            {data.vehicleSeriesLabel}
          </div>
        </Link>
      ))}
    </div>
  );
};

// Component to display a message when no brands are found
const NoSeriesFound = ({ search }: { search: string }) => {
  return (
    <div className="flex-center col-span-full h-72 flex-col text-center">
      <p className="text-xl font-semibold text-gray-800">
        No series found {search && `for "${search}"`}
      </p>
    </div>
  );
};
