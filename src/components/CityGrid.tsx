import { Link } from "react-router-dom";
import GridSkelton from "@/components/skelton/GridSkelton";
import { CityType } from "@/types/api-types/API-types";

type CityGridProps = {
  cities: CityType[];
  isLoading: boolean;
};

export const CityGrid: React.FC<CityGridProps> = ({ cities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <GridSkelton type="brand" />
      </div>
    );
  }

  if (cities.length === 0) {
    return <div className="mt-36 text-center text-2xl">No Cities Found!</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cities.map((data) => (
        <Link
          to={`/locations/manage-cities/edit/${data.cityId}`}
          key={data.cityId}
          className="flex-center h-14 w-full overflow-hidden rounded-xl border bg-white text-center text-base shadow-md hover:border-yellow hover:text-yellow"
        >
          {data.cityName}
        </Link>
      ))}
    </div>
  );
};

export default CityGrid;
