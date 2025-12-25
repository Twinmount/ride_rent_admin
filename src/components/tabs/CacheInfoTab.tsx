import { Home, FileText } from "lucide-react";
import { FC } from "react";

interface CachedSection {
  name: string;
  duration: string;
}

interface PageCache {
  page: string;
  icon: typeof Home;
  sections: CachedSection[];
}

const CACHED_PAGES: PageCache[] = [
  {
    page: "Homepage",
    icon: Home,
    sections: [
      { name: "Banner", duration: "6 hours" },
      { name: "Featured Vehicles", duration: "6 hours" },
      { name: "Newly Arrived Vehicles", duration: "6 hours" },
      { name: "Top Brands", duration: "6 hours" },
      { name: "FAQ", duration: "6 hours" },
      { name: "Promotions", duration: "6 hours" },
    ],
  },
  {
    page: "Vehicle Details Page",
    icon: FileText,
    sections: [
      { name: "FAQ", duration: "6 hours" },
      { name: "Similar Vehicles", duration: "6 hours" },
    ],
  },
];

export const CacheInfoTab: FC = () => {
  return (
    <div className="space-y-6">
      {CACHED_PAGES.map((page) => (
        <div
          key={page.page}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          {/* Page Header */}
          <div className="mb-4 flex items-center gap-2">
            <page.icon className="h-6 w-6 text-yellow" />
            <h3 className="text-lg font-semibold text-gray-800">{page.page}</h3>
          </div>

          {/* Cached Sections */}
          <div className="space-y-2">
            {page.sections.map((section) => (
              <div
                key={section.name}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <span className="text-sm font-medium text-gray-700">
                  {section.name}
                </span>
                <span className="text-yellow-800 rounded-full bg-yellow/20 px-3 py-1 text-xs font-medium">
                  cached for upto {section.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
