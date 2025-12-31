import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchBatchCallDetails, clearSelectedCampaign } from "@/store/campaignsSlice"
import { X, CheckCircle2, Clock, Phone, Users } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { PremiumSidePanel } from "@/components/premium/PremiumSidePanel"
import { PremiumPanelContent } from "@/components/premium/PremiumPanelContent"
interface CampaignDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  campaignId: string | null
}

export default function CampaignDetailsModal({ isOpen, onClose, campaignId }: CampaignDetailsModalProps) {
  const dispatch = useAppDispatch()
  const { selectedCampaign, loading } = useAppSelector((state) => state.campaigns)

  useEffect(() => {
    if (isOpen && campaignId) {
      dispatch(fetchBatchCallDetails(campaignId))
    } else {
      dispatch(clearSelectedCampaign())
    }
  }, [isOpen, campaignId, dispatch])

  if (!isOpen) return null

  return (
    <PremiumSidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={selectedCampaign ? selectedCampaign.call_name : "Campaign Details"}
      subtitle={selectedCampaign ? `Detailed metrics for ${selectedCampaign.call_name}` : undefined}
      size="xl"
    >
      <PremiumPanelContent>
          {loading || !selectedCampaign ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Status", value: selectedCampaign.status, isStatus: true },
                  { label: "Total Recipients", value: selectedCampaign.recipients.length, icon: Users },
                  { label: "Calls Dispatched", value: selectedCampaign.calls_dispatched, icon: Phone },
                  { label: "Provider", value: selectedCampaign.provider }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-black/20 border border-divider p-4 rounded-xl shadow-sm">
                    <p className="text-[12px] text-default-500 font-medium mb-1">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      {stat.icon && <stat.icon size={16} className="text-primary" />}
                      {stat.isStatus ? (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                          stat.value === 'completed' 
                            ? 'bg-success/10 text-success'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {stat.value}
                        </span>
                      ) : (
                        <span className="font-bold text-[16px] text-foreground capitalize">{stat.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Campaign Info */}
              <div className="space-y-4">
                <h3 className="text-[14px] font-bold text-foreground">Campaign Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  {[
                    { label: "Agent", value: selectedCampaign.agent_name || selectedCampaign.agent_id },
                    { label: "Created", value: new Date(selectedCampaign.created_at).toLocaleString() }
                  ].map((info, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-divider">
                      <span className="text-default-500 font-medium">{info.label}:</span>
                      <span className="font-bold text-foreground">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipients List */}
              <div className="space-y-4">
                <h3 className="text-[14px] font-bold text-foreground">Recipients ({selectedCampaign.recipients.length})</h3>
                <div className="border border-divider rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-default-50/50 text-default-500 border-b border-divider font-bold text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Phone Number</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-divider">
                      {selectedCampaign.recipients.map((recipient, index) => (
                        <tr key={index} className="hover:bg-default-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-foreground text-[13px]">{recipient.phone_number}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                              recipient.status === 'completed' || recipient.status === 'initiated'
                                ? 'bg-success/10 text-success'
                                : 'bg-default-100 text-default-600'
                            }`}>
                              {recipient.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-default-500 font-medium text-[13px]">
                            {new Date(recipient.updated_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
      </PremiumPanelContent>
    </PremiumSidePanel>
  )
}
