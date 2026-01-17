import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgents } from "@/store/agentsSlice"
import { fetchConversations } from "@/store/callHistorySlice"
import KPICards from "@/components/hero-ui/statsKPI/KPICards"
import AgentsTable from "@/components/hero-ui/xuna-table-agents/AgentsTable"


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
      title: "Voice Agents",
      subtitle: "Active",
      value: totalAgents.toString(),
      change: "3.3%",
      color: "success" as const,
      chartData: agentsData.map((v, i) => ({ month: i.toString(), value: v })),
      xaxis: "month"
    },
    {
      title: "Total Calls",
      subtitle: "Lifetime",
      value: totalCalls.toLocaleString(),
      change: "0.0%",
      color: "warning" as const,
      chartData: callsData.map((v, i) => ({ month: i.toString(), value: v })),
      xaxis: "month"
    },
    {
      title: "Total Messages",
      subtitle: "Lifetime",
      value: totalSMS.toLocaleString(),
      change: "3.3%",
      color: "danger" as const,
      chartData: smsData.map((v, i) => ({ month: i.toString(), value: v })),
      xaxis: "month"
    }
  ]

  return (
    <div className="flex flex-col gap-12 p-6 h-full overflow-hidden">
      {/* Metrics Grid */}
      <KPICards items={kpiItems} limit={3} />

      <AgentsTable />
    </div>
  )
}
