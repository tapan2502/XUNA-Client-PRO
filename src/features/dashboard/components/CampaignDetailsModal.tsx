import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchBatchCallDetails, clearSelectedCampaign } from "@/store/campaignsSlice"
import { X, Loader2, CheckCircle2, Clock, Phone, Users } from "lucide-react"

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <div className="p-1.5 bg-[#65a30d]/10 rounded-lg">
              <div className="w-4 h-4 border-2 border-[#65a30d] rounded-full" />
            </div>
            <h2 className="font-semibold text-lg">
              {selectedCampaign ? selectedCampaign.call_name : "Campaign Details"}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {loading || !selectedCampaign ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#65a30d]" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                      selectedCampaign.status === 'completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {selectedCampaign.status}
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Recipients</p>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="font-semibold text-lg">{selectedCampaign.recipients.length}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Calls Dispatched</p>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="font-semibold text-lg">{selectedCampaign.calls_dispatched}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Provider</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg capitalize">{selectedCampaign.provider}</span>
                  </div>
                </div>
              </div>

              {/* Campaign Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Campaign Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Agent:</span>
                    <span className="font-medium">{selectedCampaign.agent_name || selectedCampaign.agent_id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span className="font-medium">
                      {new Date(selectedCampaign.created_at).toLocaleString()}
                    </span>
                  </div>
                  {/* Add more fields if available in API response */}
                </div>
              </div>

              {/* Recipients List */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Recipients ({selectedCampaign.recipients.length})</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 font-medium">
                      <tr>
                        <th className="px-4 py-3">Phone Number</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedCampaign.recipients.map((recipient, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3 font-mono">{recipient.phone_number}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                              recipient.status === 'completed' || recipient.status === 'initiated'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {recipient.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
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
        </div>
      </div>
    </div>
  )
}
