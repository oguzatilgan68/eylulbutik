type ReturnStatus = "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";

type ReturnItem = {
  id: string;
  qty: number;
  status: ReturnStatus;
  reason?: string | null;
  orderItem: {
    id: string;
    name: string;
    qty: number;
    unitPrice: string;
    product?: { id: string; name: string } | null;
    variant?: { id: string; name: string } | null;
  };
};

type ReturnRequest = {
  id: string;
  reason?: string | null;
  comment?: string | null;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; email?: string; fullName?: string } | null;
  items: ReturnItem[];
  refunds: any[];
};

function Badge({ status }: { status: string }) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  if (status === "PENDING")
    return (
      <span
        className={
          base +
          " bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
        }
      >
        Pending
      </span>
    );
  if (status === "APPROVED")
    return (
      <span
        className={
          base +
          " bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
        }
      >
        Approved
      </span>
    );
  if (status === "REJECTED")
    return (
      <span
        className={
          base + " bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
        }
      >
        Rejected
      </span>
    );
  if (status === "REFUNDED")
    return (
      <span
        className={
          base +
          " bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
        }
      >
        Refunded
      </span>
    );
  return (
    <span
      className={
        base +
        " bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
      }
    >
      {status}
    </span>
  );
}

function DetailsModal({
  returnRequest,
  onClose,
  onUpdate,
}: {
  returnRequest: ReturnRequest;
  onClose: () => void;
  onUpdate: (id: string, status: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative max-w-3xl w-full bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Return #{returnRequest.id}
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {returnRequest.user?.fullName ||
                returnRequest.user?.email ||
                "Guest"}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="btn"
              onClick={() => onUpdate(returnRequest.id, "APPROVED")}
            >
              Approve
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => onUpdate(returnRequest.id, "REJECTED")}
            >
              Reject
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <section>
            <h3 className="text-sm font-medium">Reason</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {returnRequest.reason || returnRequest.comment || "-"}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-medium">Items</h3>
            <div className="space-y-2">
              {returnRequest.items.map((it) => (
                <div
                  key={it.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{it.orderItem.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Ordered: {it.orderItem.qty} — Return qty: {it.qty}
                      </div>
                    </div>
                    <div className="text-sm">
                      <Badge status={it.status} />
                    </div>
                  </div>
                  {it.reason && (
                    <div className="mt-2 text-xs text-slate-500">
                      {it.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium">Refunds</h3>
            {returnRequest.refunds.length === 0 ? (
              <div className="text-xs text-slate-500">No refunds recorded</div>
            ) : (
              <div className="space-y-2">
                {returnRequest.refunds.map((r: any) => (
                  <div
                    key={r.id}
                    className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm"
                  >
                    <div>Amount: {r.amount}</div>
                    <div className="text-xs text-slate-500">
                      Provider: {r.provider} — Status: {r.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 text-right">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
