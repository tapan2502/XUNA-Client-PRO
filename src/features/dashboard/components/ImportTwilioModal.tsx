"use client"

import { useState } from "react"
import { Phone } from "lucide-react"
import { useAppDispatch } from "@/app/hooks"
import { createPhoneNumber } from "@/store/phoneNumbersSlice"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Link,
} from "@heroui/react"
import { Icon } from "@iconify/react"

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Phone size={24} className="text-primary" />
                <span>Import Twilio Phone Number</span>
              </div>
            </ModalHeader>
            <ModalBody>
              {/* Info Box */}
              <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 rounded-lg p-3 flex gap-3">
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

              <div className="flex flex-col gap-4">
                <Input
                  label="Phone Number"
                  placeholder="+1234567890"
                  description="Enter the phone number in E.164 format (e.g., +1234567890)"
                  value={formData.phone_number}
                  onValueChange={(val) => setFormData({ ...formData, phone_number: val })}
                  variant="bordered"
                  labelPlacement="outside"
                />

                <Input
                  label="Label"
                  placeholder="Support Line"
                  value={formData.label}
                  onValueChange={(val) => setFormData({ ...formData, label: val })}
                  variant="bordered"
                  labelPlacement="outside"
                />

                <Input
                  label="Twilio Account SID"
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={formData.sid}
                  onValueChange={(val) => setFormData({ ...formData, sid: val })}
                  variant="bordered"
                  labelPlacement="outside"
                />

                <Input
                  label="Twilio Auth Token"
                  placeholder="Enter your Twilio auth token"
                  type="password"
                  value={formData.token}
                  onValueChange={(val) => setFormData({ ...formData, token: val })}
                  variant="bordered"
                  labelPlacement="outside"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                className="shadow-sm"
                onPress={handleSubmit}
                isLoading={loading}
              >
                Import Number
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
