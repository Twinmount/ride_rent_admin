import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { RefreshCw, Tag, Route, Info } from "lucide-react";
import { revalidatePath, revalidateTag } from "@/api/cache";
import { toast } from "@/components/ui/use-toast";
import { TagRevalidationTab } from "@/components/tabs/TagRevalidationTab";
import { PathRevalidationTab } from "@/components/tabs/PathRevalidationTab";
import { CacheInfoTab } from "@/components/tabs/CacheInfoTab";

type TabType = "info" | "path" | "tag";

const ManageCachePage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [pathInput, setPathInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Path revalidation mutation
  const pathMutation = useMutation({
    mutationFn: revalidatePath,
    onSuccess: () => {
      toast({
        title: "Page Cache Revalidated",
        description:
          "You can visit the corresponding nextjs page to see the changes",
        className: "bg-yellow text-white",
      });
      setPathInput("");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to revalidate page cache",
        description: error.message,
      });
    },
  });

  // Tag revalidation mutation
  const tagMutation = useMutation({
    mutationFn: revalidateTag,
    onSuccess: () => {
      toast({
        title: "Tag Cache Revalidated",
        description:
          "You can visit the corresponding nextjs page to see the changes",
        className: "bg-yellow text-white",
      });
      setTagInput("");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to revalidate tag cache",
        description: error.message,
      });
    },
  });

  const handlePathRevalidate = (path: string) => {
    if (!path.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Path",
        description: "Please enter a valid path",
      });
      return;
    }
    pathMutation.mutate(path);
  };

  const handleTagRevalidate = (tag: string) => {
    if (!tag.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Tag",
        description: "Please enter a valid tag",
      });
      return;
    }
    tagMutation.mutate(tag);
  };

  const isLoading = pathMutation.isPending || tagMutation.isPending;

  return (
    <section className="relative h-auto min-h-screen bg-gray-50 p-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <RefreshCw className="h-7 w-7 text-yellow" />
            Cache Management
          </h2>
          <p className="mt-2 text-gray-600">
            Manage Next.js platform cache - view cached sections and revalidate
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 rounded-lg bg-white shadow">
          <div className="flex border-b">
            {/* Info Tab */}
            <button
              onClick={() => setActiveTab("info")}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === "info"
                  ? "border-b-2 border-yellow text-yellow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Info className="h-5 w-5" />
              Cache Info
            </button>

            {/* Path Tab */}
            <button
              onClick={() => setActiveTab("path")}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === "path"
                  ? "border-b-2 border-yellow text-yellow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Route className="h-5 w-5" />
              Path Revalidation
            </button>

            {/* Tag Tab */}
            <button
              onClick={() => setActiveTab("tag")}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === "tag"
                  ? "border-b-2 border-yellow text-yellow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Tag className="h-5 w-5" />
              Tag Revalidation
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "info" ? (
              <CacheInfoTab />
            ) : activeTab === "path" ? (
              <PathRevalidationTab
                pathInput={pathInput}
                setPathInput={setPathInput}
                onRevalidate={handlePathRevalidate}
                isLoading={isLoading}
              />
            ) : (
              <TagRevalidationTab
                tagInput={tagInput}
                setTagInput={setTagInput}
                onRevalidate={handleTagRevalidate}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageCachePage;
