import { useState } from "react"
import { Phone } from "lucide-react"
import { useAppDispatch } from "@/app/hooks"
import { createPhoneNumber } from "@/store/phoneNumbersSlice"
import { Button, Input } from "@heroui/react"
import { Icon } from "@iconify/react"
import { PremiumSidePanel } from "@/components/premium/PremiumSidePanel"
import { PremiumInput } from "@/components/premium/PremiumInput"
import { PremiumPanelContent } from "@/components/premium/PremiumPanelContent"
import { PremiumFormSection } from "@/components/premium/PremiumFormComponents"

interface ImportSIPModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ImportSIPModal({ isOpen, onClose }: ImportSIPModalProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone_number: "",
    label: "",
    sip_address: "",
    username: "",
    password: "",
  })

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await dispatch(
        createPhoneNumber({
          ...formData,
          provider: "sip",
        }),
      ).unwrap()
      onClose()
      // Reset form
      setFormData({
        phone_number: "",
        label: "",
        sip_address: "",
        username: "",
        password: "",
      })
    } catch (error) {
      console.error("Failed to import SIP number:", error)
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
        Import SIP Trunk
      </Button>
    </div>
  )

  return (
    <PremiumSidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Import SIP Trunk"
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
                <li>An active SIP trunk provider</li>
                <li>SIP credentials (username & password)</li>
                <li>SIP address/domain</li>
                </ul>
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
                    placeholder="Main SIP Line"
                    value={formData.label}
                    onValueChange={(val) => setFormData({ ...formData, label: val })}
                    labelPlacement="outside"
                />

                <PremiumInput
                    label="SIP Address"
                    placeholder="sip.example.com"
                    value={formData.sip_address}
                    onValueChange={(val) => setFormData({ ...formData, sip_address: val })}
                    labelPlacement="outside"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PremiumInput
                    label="Username"
                    placeholder="username"
                    value={formData.username}
                    onValueChange={(val) => setFormData({ ...formData, username: val })}
                    labelPlacement="outside"
                    />

                    <PremiumInput
                    label="Password"
                    placeholder="password"
                    type="password"
                    value={formData.password}
                    onValueChange={(val) => setFormData({ ...formData, password: val })}
                    labelPlacement="outside"
                    />
                </div>
            </PremiumFormSection>
      </PremiumPanelContent>
    </PremiumSidePanel>
  )
}

