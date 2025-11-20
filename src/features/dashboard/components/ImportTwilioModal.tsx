"use client"

import { useState } from "react"
import { Phone, X, Loader2 } from "lucide-react"
import { useAppDispatch } from "@/app/hooks"
import { createPhoneNumber } from "@/store/phoneNumbersSlice"

interface ImportTwilioModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ImportTwilioModal({ isOpen, onClose }: ImportTwilioModalProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone_number: "",
    label: "",
    sid: "",
    token: "",
  })

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await dispatch(
        createPhoneNumber({
          ...formData,
          provider: "twilio",
        }),
      ).unwrap()
      onClose()
      // Reset form
      setFormData({
        phone_number: "",
        label: "",
        sid: "",
        token: "",
      })
    } catch (error) {
      console.error("Failed to import Twilio number:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl w-full max-w-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-900 dark:text-gray-100" />
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Import Twilio Phone Number</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          <div className="flex flex-col gap-5">
            {/* Info Box */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3 flex gap-3">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Before you begin</span>
                <span className="text-blue-600 dark:text-blue-400">Make sure you have:</span>
                <ul className="list-disc list-inside text-blue-600 dark:text-blue-400 ml-1 space-y-0.5">
                  <li>An active Twilio account</li>
                  <li>A purchased phone number</li>
                  <li>Your Account SID and Auth Token</li>
                </ul>
                <a
                  href="https://console.twilio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-300 font-medium hover:underline mt-0.5 flex items-center gap-1"
                >
                  Visit Twilio Console
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path
                      fillRule="evenodd"
                      d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-popover-foreground">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1234567890"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65a30d]/20 focus:border-[#65a30d] transition-all text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <p className="text-[10px] text-gray-600 dark:text-gray-400">
                  Enter the phone number in E.164 format (e.g., +1234567890)
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-popover-foreground">Label</label>
                <input
                  type="text"
                  placeholder="Support Line"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65a30d]/20 focus:border-[#65a30d] transition-all text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-popover-foreground">Twilio Account SID</label>
                <input
                  type="text"
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={formData.sid}
                  onChange={(e) => setFormData({ ...formData, sid: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65a30d]/20 focus:border-[#65a30d] transition-all text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-popover-foreground">Twilio Auth Token</label>
                <input
                  type="password"
                  placeholder="Enter your Twilio auth token"
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65a30d]/20 focus:border-[#65a30d] transition-all text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Import Number
          </button>
        </div>
      </div>
    </div>
  )
}
