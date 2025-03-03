import { PromotedAgent } from "@/types/api-types/API-types";
import { DeleteAgentType } from "./PromotedCompanyCard";

type PropType = {
  agent: PromotedAgent;
  stateId: string;
  categoryId: string;
  onDelete: DeleteAgentType;
};

export default function AgentSubCard({
  agent,
  stateId,
  categoryId,
  onDelete,
}: PropType) {
  return (
    <div className="group relative flex h-20 w-40 items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
      {/* Left Section: Image */}
      <div className="flex h-full w-16 min-w-16 items-center justify-center bg-gray-100">
        <img
          src={agent.companyLogoUrl}
          alt={agent.companyName}
          className="r h-full w-full object-cover"
        />
      </div>

      {/* Right Section: Text */}
      <div className="flex w-full flex-col justify-center p-2">
        <p className="line-clamp-2 w-full text-xs font-medium text-gray-700">
          {agent.companyName}
        </p>
        <p className="mt-2 w-fit rounded-md bg-gray-200 px-1 text-center text-[10px] text-gray-500">
          ID: {agent.agentId}
        </p>
      </div>

      {/* Delete Button (Visible on Hover) */}
      <button
        onClick={() =>
          onDelete({
            companyId: agent.companyId,
            stateId,
            categoryId,
          })
        }
        className="absolute right-1 top-1 hidden h-5 w-5 rounded-full bg-red-500 text-xs text-white shadow-md hover:bg-red-600 group-hover:block"
      >
        ✖
      </button>
    </div>
  );
}
