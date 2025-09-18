import { MessageSquare } from "lucide-react";

interface EnquiryStatsCardsProps {
  pendingCount: number;
  acceptedCount: number;
  cancelledCount: number;
}

export function EnquiryStatsCards({
  pendingCount,
  acceptedCount,
  cancelledCount,
}: EnquiryStatsCardsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              Pending Enquiries
            </div>
            <div className="text-2xl font-bold text-primary">
              {pendingCount}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <MessageSquare className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              Accepted Enquiries
            </div>
            <div className="text-2xl font-bold text-green-600">
              {acceptedCount}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
            <MessageSquare className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              Cancelled Enquiries
            </div>
            <div className="text-2xl font-bold text-red-600">
              {cancelledCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
