import { PromotedAgent } from "@/types/api-types/API-types";

type PropType = {
  agent: PromotedAgent;
  onDelete: (companyId: string, stateId: string, categoryId: string) => void;
};

export default function AgentSubCard({ agent, onDelete }: PropType) {
  return (
    <div className="group relative flex h-20 w-40 items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
      {/* Left Section: Image */}
      <div className="flex h-full w-16 min-w-16 items-center justify-center bg-gray-100">
        <img
          src={agent.companyLogo}
          alt={agent.companyName}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>

      {/* Right Section: Text */}
      <div className="flex w-full flex-col justify-center px-3">
        <p className="line-clamp-1 truncate text-xs font-medium text-gray-700">
          {agent.companyName}
        </p>
        <p className="text-[10px] text-gray-500">ID: {agent.agentId}</p>
      </div>

      {/* Delete Button (Visible on Hover) */}
      <button
        onClick={() =>
          onDelete(agent.companyId, "some-state-id", "some-category-id")
        }
        className="absolute right-1 top-1 hidden h-5 w-5 rounded-full bg-red-500 text-xs text-white shadow-md hover:bg-red-600 group-hover:block"
      >
        ✖
      </button>
    </div>
  );
}
