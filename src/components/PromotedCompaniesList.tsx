import PromotedCompanyCard from "./card/PromotedCompanyCard";
import DeletePromotedAgentPopup from "./dialog/DeletePromotedAgentPopup";
import AddPromotedAgentPopup from "./dialog/AddPromotedAgentPopup";
import usePromotedCompanies from "@/pages/company/company-hooks/CompanyHooks";

export default function PromotedCompaniesList() {
  const {
    selectedAgentForDelete,
    setSelectedAgentForDelete,
    selectedInfoForAdd,
    setSelectedInfoForAdd,
    promotedCompaniesList,
    isLoading,
    handleCloseDeleteModal,
    handleCloseAddModal,
  } = usePromotedCompanies();

  if (isLoading) {
    return (
      <div className="flex-center h-40 w-full">
        <p className="text-sm font-semibold text-gray-600">Fetching...</p>
      </div>
    );
  }

  if (promotedCompaniesList.length === 0) {
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
      {/*maps over the list */}
      {promotedCompaniesList.map((data) => (
        <PromotedCompanyCard
          key={data.category.categoryId}
          data={data}
          onDeleteAgent={({ companyId, stateId, categoryId }) => {
            setSelectedAgentForDelete({ companyId, stateId, categoryId });
          }}
          onAddAgent={(stateId, categoryId) =>
            setSelectedInfoForAdd({ stateId, categoryId })
          }
        />
      ))}

      {/* Render Delete Dialog */}
      <DeletePromotedAgentPopup
        isOpen={!!selectedAgentForDelete}
        selectedAgentForDelete={selectedAgentForDelete}
        onClose={handleCloseDeleteModal}
      />

      {/* Render Add Dialog */}
      <AddPromotedAgentPopup
        isOpen={!!selectedInfoForAdd}
        onClose={handleCloseAddModal}
        stateCategoryInfo={selectedInfoForAdd}
      />
    </>
  );
}
