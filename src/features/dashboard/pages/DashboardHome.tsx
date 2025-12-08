import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAgents } from "@/store/agentsSlice"
import { fetchConversations } from "@/store/callHistorySlice"
import KpiStatsCard from "@/components/hero-ui/KpiStatsCard"
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

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0">
        <KpiStatsCard
          title="Agents"
          value={totalAgents.toString()}
          change="3.3%"
          color="success"
          data={agentsData.map((v) => ({ value: v }))}
        />
        <KpiStatsCard
          title="Total Calls"
          value={totalCalls.toLocaleString()}
          change="0.0%"
          color="warning"
          data={callsData.map((v) => ({ value: v }))}
        />
        <KpiStatsCard
          title="Total SMS"
          value={totalSMS.toLocaleString()}
          change="-3.3%"
          color="danger"
          data={smsData.map((v) => ({ value: v }))}
        />
      </div>

      <div className="flex-1 min-h-0">
        <ClientsTable />
      </div>
    </div>
  )
}
