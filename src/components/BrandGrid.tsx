import { Link } from "react-router-dom";
import GridSkelton from "@/components/skelton/GridSkelton";
import { BrandType } from "@/types/api-types/API-types";

type BrandGridProps = {
  brandList: BrandType[];
  isBrandsLoading: boolean;
  search: string;
  categoryValue: string | null | undefined;
};

export const BrandGrid: React.FC<BrandGridProps> = ({
  brandList,
  isBrandsLoading,
  search,
  categoryValue,
}) => {
  const baseAssetsUrl = import.meta.env.VITE_ASSETS_URL;

  if (isBrandsLoading) {
    return (
      <div className="grid grid-cols-3 place-items-center gap-2 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        <GridSkelton type="brand" />
      </div>
    );
  }

  if (brandList.length === 0) {
    return <NoBrandsFound search={search || ""} />;
  }

  return (
    <div className="grid grid-cols-2 place-items-center gap-2 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {brandList.map((data) => (
        <Link
          to={`/manage-brands/edit/${data.id}`}
          key={data.id}
          className="h-36 w-full min-w-32 rounded-xl border bg-white"
        >
          <div className="flex-center h-[7.5rem] w-auto p-2">
            <img
              src={`${baseAssetsUrl}/icons/brands/${categoryValue}/${data.brandValue}.png`}
              alt={data.brandValue}
              className="h-full w-[95%] max-w-28 object-contain"
            />
          </div>
          <div className="max-w-full text-center text-sm font-semibold">
            {data.brandName}
          </div>
        </Link>
      ))}
    </div>
  );
};

// Component to display a message when no brands are found
const NoBrandsFound = ({ search }: { search: string }) => {
  return (
    <div className="flex-center col-span-full h-72 flex-col text-center">
      <p className="text-xl font-semibold text-gray-800">
        No brands found {search && `for "${search}"`}
      </p>
    </div>
  );
};
