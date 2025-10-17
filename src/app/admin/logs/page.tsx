import LogsTable from "@/app/(marketing)/components/admin/LogsTable";

export default function AdminLogsPage() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Loglar</h1>
      <LogsTable />
    </div>
  );
}
