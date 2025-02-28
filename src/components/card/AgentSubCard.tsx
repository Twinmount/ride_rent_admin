import { PromotedAgent } from "@/types/api-types/API-types";

type PropType = {
  agent: PromotedAgent;
  onDelete: (companyId: string, stateId: string, categoryId: string) => void;
};

export default function AgentSubCard({ agent, onDelete }: PropType) {
  return (
    <div className="group relative flex h-20 w-32 flex-col items-center justify-center rounded-lg border border-gray-300 bg-white shadow-sm">
      <img
        src={agent.companyLogo}
        alt={agent.companyName}
        className="h-10 w-10 rounded-full object-cover"
      />
      <p className="mt-1 text-xs font-medium text-gray-700">
        {agent.companyName}
      </p>

      {/* Delete Button */}
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
