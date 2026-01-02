import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgents } from "@/store/agentsSlice"
import { fetchConversations } from "@/store/callHistorySlice"
import KPICards from "@/components/hero-ui/statsKPI/KPICards"
import ClientsTable from "../components/ClientsTable"


  export default function DashboardHome() {
  const dispatch = useAppDispatch()
  const { agents } = useAppSelector((state) => state.agents)
  const { conversations } = useAppSelector((state) => state.callHistory)

  useEffect(() => {
    dispatch(fetchAgents())
    dispatch(fetchConversations())
  }, [dispatch])

  // Mock data for charts
  const agentsData = [40, 45, 42, 48, 50, 52, 55, 53, 58, 60]
  const callsData = [30, 35, 32, 38, 40, 42, 45, 43, 48, 50]
  const smsData = [50, 48, 45, 42, 40, 38, 35, 32, 30, 28]

  const totalAgents = agents?.length || 0
  const totalCalls = conversations?.length || 0
  const totalSMS = 943 // Hardcoded as requested

  const kpiItems = [
    {
      title: "Agents",
      subtitle: "Active Agents",
      value: totalAgents.toString(),
      change: "3.3%",
      color: "success" as const,
      chartData: agentsData.map((v, i) => ({ month: i.toString(), value: v })),
      xaxis: "month"
    },
    {
      title: "Total Calls",
      subtitle: "Lifetime Calls",
      value: totalCalls.toLocaleString(),
      change: "0.0%",
      color: "warning" as const,
      chartData: callsData.map((v, i) => ({ month: i.toString(), value: v })),
      xaxis: "month"
    },
    {
      title: "Total SMS",
      subtitle: "Lifetime SMS",
      value: totalSMS.toLocaleString(),
      change: "3.3%",
      color: "danger" as const,
      chartData: smsData.map((v, i) => ({ month: i.toString(), value: v })),
      xaxis: "month"
    }
  ]

  return (
    <div className="flex flex-col gap-4 p-6 h-full overflow-hidden">
      {/* Metrics Grid */}
      <KPICards items={kpiItems} limit={3} />

      {/* Clients Table */}
      <div className="flex-1 min-h-0">
        <ClientsTable />
      </div>
    </div>
  )
}
