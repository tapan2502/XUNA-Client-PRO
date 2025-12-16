"use client"

import { useState } from "react"
import { Shield, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { Card, CardBody, Switch, Slider, RadioGroup, Radio } from "@heroui/react"

interface PrivacySettingsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function PrivacySettingsSection({ agent, onChange }: PrivacySettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const privacy = agent.platform_settings?.privacy || {}
  const conversationInitiation = agent.platform_settings?.conversation_initiation || "user_starts"

  return (
    <div className="space-y-4">
      {/* Privacy Settings */}
      <Card shadow="sm" className="border border-default-200">
        <CardBody className="p-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-default-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-default-700">Privacy Settings</h3>
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {isExpanded && (
            <div className="px-5 pb-5 pt-2 space-y-5 border-t border-default-200 bg-default-50/50">
              {/* Record Voice */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Record Voice</h4>
                  <p className="text-tiny text-default-400">Whether to record the conversation</p>
                </div>
                <Switch
                  isSelected={privacy.record_voice ?? true}
                  onValueChange={(checked) => onChange("platform_settings.privacy.record_voice", checked)}
                />
              </div>

              {/* Retention Days */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">
                  Retention Days ({privacy.retention_days === -1 ? "No limit" : privacy.retention_days || 0})
                </label>
                <Slider
                  step={1}
                  maxValue={365}
                  minValue={-1}
                  value={privacy.retention_days ?? -1}
                  onChange={(value) => onChange("platform_settings.privacy.retention_days", value as number)}
                  size="sm"
                  marks={[
                    { value: -1, label: "No limit" },
                    { value: 30, label: "30" },
                    { value: 90, label: "90" },
                    { value: 365, label: "365" },
                  ]}
                  className="max-w-md"
                />
                <p className="text-tiny text-default-400">Days to retain conversation data (-1 for no limit)</p>
              </div>

              {/* Delete Transcript and PII */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Delete Transcript and PII</h4>
                  <p className="text-tiny text-default-400">Whether to delete the transcript and PII</p>
                </div>
                <Switch
                  isSelected={privacy.delete_transcript_and_pii ?? false}
                  onValueChange={(checked) => onChange("platform_settings.privacy.delete_transcript_and_pii", checked)}
                />
              </div>

              {/* Delete Audio */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Delete Audio</h4>
                  <p className="text-tiny text-default-400">Whether to delete the audio</p>
                </div>
                <Switch
                  isSelected={privacy.delete_audio ?? false}
                  onValueChange={(checked) => onChange("platform_settings.privacy.delete_audio", checked)}
                />
              </div>

              {/* Apply to Existing Conversations */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Apply to Existing Conversations</h4>
                  <p className="text-tiny text-default-400">Apply privacy settings to existing conversations</p>
                </div>
                <Switch
                  isSelected={privacy.apply_to_existing_conversations ?? false}
                  onValueChange={(checked) =>
                    onChange("platform_settings.privacy.apply_to_existing_conversations", checked)
                  }
                />
              </div>

              {/* Zero Retention Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Zero Retention Mode</h4>
                  <p className="text-tiny text-default-400">No PII data is stored</p>
                </div>
                <Switch
                  isSelected={privacy.zero_retention_mode ?? false}
                  onValueChange={(checked) => onChange("platform_settings.privacy.zero_retention_mode", checked)}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Conversation Initiation */}
      <Card shadow="sm" className="border border-default-200">
        <CardBody className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-default-700">Conversation Initiation</h3>
          </div>
          <RadioGroup
            value={conversationInitiation}
            onValueChange={(value) => onChange("platform_settings.conversation_initiation", value)}
            orientation="horizontal"
          >
            <Radio value="bot_starts">Bot starts conversation</Radio>
            <Radio value="user_starts">User starts conversation</Radio>
          </RadioGroup>
          <p className="text-tiny text-default-400">
            Choose whether the bot should greet the user first or wait for the user to speak
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
