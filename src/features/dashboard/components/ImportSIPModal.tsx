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
} from "@heroui/react"
import { Icon } from "@iconify/react"

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Phone size={24} className="text-primary" />
                <span>Import SIP Trunk</span>
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
                    <li>An active SIP trunk provider</li>
                    <li>SIP credentials (username & password)</li>
                    <li>SIP address/domain</li>
                  </ul>
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
                  placeholder="Main SIP Line"
                  value={formData.label}
                  onValueChange={(val) => setFormData({ ...formData, label: val })}
                  variant="bordered"
                  labelPlacement="outside"
                />

                <Input
                  label="SIP Address"
                  placeholder="sip.example.com"
                  value={formData.sip_address}
                  onValueChange={(val) => setFormData({ ...formData, sip_address: val })}
                  variant="bordered"
                  labelPlacement="outside"
                />

                <div className="flex gap-4">
                  <Input
                    className="flex-1"
                    label="Username"
                    placeholder="username"
                    value={formData.username}
                    onValueChange={(val) => setFormData({ ...formData, username: val })}
                    variant="bordered"
                    labelPlacement="outside"
                  />

                  <Input
                    className="flex-1"
                    label="Password"
                    placeholder="password"
                    type="password"
                    value={formData.password}
                    onValueChange={(val) => setFormData({ ...formData, password: val })}
                    variant="bordered"
                    labelPlacement="outside"
                  />
                </div>
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
                Import SIP Trunk
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
