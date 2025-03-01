import { PromotedCompanyCardType } from "@/types/api-types/API-types";
import AgentSubCard from "./AgentSubCard";
import { toast } from "../ui/use-toast";

type PropType = {
  data: PromotedCompanyCardType;
  onDeleteAgent: (
    companyId: string,
    stateId: string,
    categoryId: string,
  ) => void;
  onAddAgent: (stateId: string, categoryId: string) => void;
};

export default function PromotedCompanyCard({
  data,
  onDeleteAgent,
  onAddAgent,
}: PropType) {
  const handler = () => {
    if (data.agents.length === 4) {
      toast({
        variant: "destructive",
        title: "Agent limit reached",
        description: "You can only add 4 agents, remove some to add more",
      });
      return;
    }
    onAddAgent(data.state.stateId, data.category.categoryId);
  };

  return (
    <div className="mx-auto mb-6 w-full max-w-3xl rounded-lg bg-white p-4 shadow-md">
      {/* Header Section */}
      <div className="mb-3 flex items-center gap-x-3">
        <span className="rounded-[0.5rem] bg-gray-800 px-3 py-0 text-sm text-white">
          {data.state.stateName}
        </span>
        <span className="rounded-[0.5rem] bg-gray-800 px-3 py-0 text-sm text-white">
          {data.category.categoryName}
        </span>
      </div>

      {/* Agent List Section */}
      <div className="mt-4 flex flex-wrap gap-4">
        {data.agents.map((agent) => (
          <AgentSubCard
            key={agent.agentId}
            agent={agent}
            onDelete={onDeleteAgent}
          />
        ))}

        {/* Add Agent Button */}

        <button
          onClick={handler}
          className="flex h-20 w-20 items-center justify-center rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
        >
          ➕
        </button>
      </div>
    </div>
  );
}
