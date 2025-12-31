import { useState } from "react"
import { Phone } from "lucide-react"
import { useAppDispatch } from "@/app/hooks"
import { createPhoneNumber } from "@/store/phoneNumbersSlice"
import { Button, Input, Link } from "@heroui/react"
import { Icon } from "@iconify/react"
import { PremiumSidePanel } from "@/components/premium/PremiumSidePanel"
import { PremiumInput } from "@/components/premium/PremiumInput"
import { PremiumPanelContent } from "@/components/premium/PremiumPanelContent"
import { PremiumFormSection } from "@/components/premium/PremiumFormComponents"

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

  const footer = (
    <div className="flex justify-end gap-2 w-full">
      <Button variant="light" onPress={onClose} className="font-medium">
        Cancel
      </Button>
      <Button
        color="primary"
        className="font-bold px-4 shadow-lg shadow-primary/20 h-9"
        onPress={handleSubmit}
        isLoading={loading}
      >
        Import Number
      </Button>
    </div>
  )

  return (
    <PremiumSidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Import Twilio Phone Number"
      size="md"
      footer={footer}
    >
      <PremiumPanelContent>
            {/* Info Box */}
            <div className="bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 rounded-lg p-3 flex gap-3">
            <Icon icon="solar:info-circle-linear" className="text-primary mt-0.5 shrink-0" width={18} />
            <div className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-primary">Before you begin</span>
                <span className="text-primary-600 dark:text-primary-300">Make sure you have:</span>
                <ul className="list-disc list-inside text-primary-600 dark:text-primary-300 ml-1 space-y-0.5">
                <li>An active Twilio account</li>
                <li>A purchased phone number</li>
                <li>Your Account SID and Auth Token</li>
                </ul>
                <Link
                href="https://console.twilio.com"
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                isExternal
                showAnchorIcon
                >
                Visit Twilio Console
                </Link>
            </div>
            </div>

            <PremiumFormSection title="Configuration">
                <PremiumInput
                    label="Phone Number"
                    placeholder="+1234567890"
                    description="Enter the phone number in E.164 format (e.g., +1234567890)"
                    value={formData.phone_number}
                    onValueChange={(val) => setFormData({ ...formData, phone_number: val })}
                    labelPlacement="outside"
                />

                <PremiumInput
                    label="Label"
                    placeholder="Support Line"
                    value={formData.label}
                    onValueChange={(val) => setFormData({ ...formData, label: val })}
                    labelPlacement="outside"
                />

                <PremiumInput
                    label="Twilio Account SID"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={formData.sid}
                    onValueChange={(val) => setFormData({ ...formData, sid: val })}
                    labelPlacement="outside"
                />

                <PremiumInput
                    label="Twilio Auth Token"
                    placeholder="Enter your Twilio auth token"
                    type="password"
                    value={formData.token}
                    onValueChange={(val) => setFormData({ ...formData, token: val })}
                    labelPlacement="outside"
                />
            </PremiumFormSection>
      </PremiumPanelContent>
    </PremiumSidePanel>
  )
}

