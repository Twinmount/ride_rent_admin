import { promotedCompanies as Data } from "@/pages/company";
import PromotedCompanyCard from "./card/PromotedCompanyCard";
import DeletePromotedAgentPopup from "./dialog/DeletePromotedAgentPopup";
import AddPromotedAgentPopup from "./dialog/AddPromotedAgentPopup";
import usePromotedCompanies from "@/pages/company/company-hooks/CompanyHooks";

export default function PromotedCompaniesList() {
  const {
    selectedAgentForDelete,
    setSelectedAgentForDelete,
    selectedCategoryForAdd,
    setSelectedCategoryForAdd,
    promotedCompanies,
    isLoading,
  } = usePromotedCompanies();

  const list = promotedCompanies || Data;

  if (isLoading) {
    return (
      <div className="flex-center h-40 w-full">
        <p className="text-sm font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex-center h-40 w-full">
        <p className="text-sm font-semibold text-gray-600">
          No promoted companies found
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Render Company Cards */}
      {list.map((data) => (
        <PromotedCompanyCard
          key={data.category.categoryId}
          data={data}
          onDeleteAgent={(companyId, stateId, categoryId) =>
            setSelectedAgentForDelete({ companyId, stateId, categoryId })
          }
          onAddAgent={(stateId, categoryId) =>
            setSelectedCategoryForAdd({ stateId, categoryId })
          }
        />
      ))}

      {/* Render Delete Dialog */}
      <DeletePromotedAgentPopup
        isOpen={!!selectedAgentForDelete}
        onClose={() => setSelectedAgentForDelete(null)}
        companyId={selectedAgentForDelete?.companyId ?? ""}
        stateId={selectedAgentForDelete?.stateId ?? ""}
        categoryId={selectedAgentForDelete?.categoryId ?? ""}
      />

      {/* Render Add Dialog */}
      <AddPromotedAgentPopup
        isOpen={!!selectedCategoryForAdd}
        onClose={() => setSelectedCategoryForAdd(null)}
        stateId={selectedCategoryForAdd?.stateId ?? ""}
        categoryId={selectedCategoryForAdd?.categoryId ?? ""}
      />
    </>
  );
}
