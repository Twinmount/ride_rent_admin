import { MessageSquare, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface EnquiryStatsCardsProps {
  totalCount: number;
  pendingCount: number;
  acceptedCount: number;
  cancelledCount: number;
  expiredCount: number;
}

export function EnquiryStatsCards({
  totalCount,
  pendingCount,
  acceptedCount,
  cancelledCount,
  expiredCount,
}: EnquiryStatsCardsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              Total Enquiries
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {totalCount}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              New Enquiries
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
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              Contacted
            </div>
            <div className="text-2xl font-bold text-green-600">
              {acceptedCount}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              Expired
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {expiredCount}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              Cancelled
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
