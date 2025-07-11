import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeading from "../general/PageHeading";

type PageLayoutProps = {
  heading: string;
  subheading?: string;
  children: React.ReactNode;
  shouldRenderNavigation?: boolean;
  headingClassName?: string;
};

export default function PageLayout({
  heading,
  subheading,
  children,
  shouldRenderNavigation = false,
  headingClassName,
}: PageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="container h-auto min-h-screen bg-slate-50 py-6 pb-16">
      <div className={`mb-5 ml-2 w-fit flex-col gap-x-4 ${headingClassName}`}>
        <div className="flex w-fit items-center gap-x-4">
          {/* navigation button */}
          {shouldRenderNavigation && (
            <button
              onClick={() => navigate(-1)}
              className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
            >
              <CircleArrowLeft />
            </button>
          )}
          {/* heading */}
          <PageHeading heading={heading} />
        </div>
        {/* sub heading */}
        {subheading && (
          <h2 className="text-md ml-10 text-gray-600">{subheading}</h2>
        )}
      </div>

      {children}
    </div>
  );
}
