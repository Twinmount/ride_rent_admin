import PromotedCompaniesList from "@/components/PromotedCompaniesList";
import { useAdminContext } from "@/context/AdminContext";

export default function CompanyPromotionPage() {
  const { state } = useAdminContext();

  return (
    <section className="h-auto min-h-screen w-full bg-gray-100 py-10">
      <div className="mb-6 flex flex-col">
        <h1 className="mb-5 text-center text-2xl font-semibold lg:ml-6 lg:text-left">
          Promoted Agents under {state.stateName}
        </h1>
      </div>

      <PromotedCompaniesList />
    </section>
  );
}
