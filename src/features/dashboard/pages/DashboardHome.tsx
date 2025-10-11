import MetricCard from "../components/MetricCard"
import ClientsTable from "../components/ClientsTable"

export default function DashboardHome() {
  // Mock data for charts
  const agentsData = [40, 45, 42, 48, 50, 52, 55, 53, 58, 60]
  const callsData = [30, 35, 32, 38, 40, 42, 45, 43, 48, 50]
  const smsData = [50, 48, 45, 42, 40, 38, 35, 32, 30, 28]

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Agents" value="317" change={3.3} chartColor="#10b981" data={agentsData} />
        <MetricCard title="Total Calls" value="1,592" change={0.0} chartColor="#f59e0b" data={callsData} />
        <MetricCard title="Total SMS" value="943" change={-3.3} chartColor="#ef4444" data={smsData} />
      </div>

      {/* Clients Table */}
      <ClientsTable />
    </div>
  )
}
