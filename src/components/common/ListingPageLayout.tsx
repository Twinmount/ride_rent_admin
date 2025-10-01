import { ReactNode } from "react";
import PageHeading from "../general/PageHeading";

type ListingPageLayoutProps = {
  heading: string | ReactNode;
  sortDropdown?: ReactNode;
  limitDropdown?: ReactNode;
  search?: ReactNode;
  actionButton?: ReactNode;
  extraFilters?: ReactNode;
  children: ReactNode;
};

/**
 * ListingPageLayout
 *
 * A layout wrapper for  listing pages.
 * Provides a consistent structure with a heading,
 * optional sort and limit dropdowns, a search box,
 * and page content.
 *
 * Designed for pages with data tables and filtering controls.
 */
export default function ListingPageLayout({
  heading,
  sortDropdown,
  limitDropdown,
  search,
  actionButton,
  extraFilters,
  children,
}: ListingPageLayoutProps) {
  return (
    <section className="container mx-auto min-h-screen py-5 md:py-7">
      {/* Heading & controls */}
      <div className="flex-between my-2 mb-2 max-md:flex-col">
        {/* Heading */}
        {typeof heading === "string" ? (
          <PageHeading heading={heading} />
        ) : (
          heading
        )}
      </div>

      <div className="mb-4 mt-3 flex w-full flex-wrap items-start justify-start gap-2 max-sm:mt-3">
        {search && search}

        {actionButton && actionButton}

        {/* sort dropdown */}
        {sortDropdown && sortDropdown}

        {/* limit dropdown */}
        {limitDropdown && limitDropdown}

        {/* Extra filters */}
        {extraFilters && extraFilters}
      </div>

      {/* Search box */}

      {/* Main content */}
      {children}
    </section>
  );
}
