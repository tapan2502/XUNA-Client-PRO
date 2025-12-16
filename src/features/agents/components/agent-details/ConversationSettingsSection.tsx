"use client"

import { useState } from "react"
import { MessageCircle, Clock, PhoneOff, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardBody, Slider, RadioGroup, Radio } from "@heroui/react"

interface ConversationSettingsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function ConversationSettingsSection({ agent, onChange }: ConversationSettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const turn = agent.conversation_config?.turn || {}

  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="p-0 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-default-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-default-700">Conversation Settings</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-default-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-default-500" />
          )}
        </button>

        {isExpanded && (
          <div className="px-5 pb-5 pt-2 space-y-6 border-t border-default-200 bg-default-50/50">
            {/* Turn Timeout */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium">Turn Timeout ({turn.turn_timeout || 7}s)</label>
              </div>
              <Slider
                step={1}
                maxValue={30}
                minValue={1}
                value={turn.turn_timeout || 7}
                onChange={(value) => onChange("conversation_config.turn.turn_timeout", value as number)}
                size="sm"
                marks={[
                  { value: 1, label: "1s" },
                  { value: 15, label: "15s" },
                  { value: 30, label: "30s" },
                ]}
                className="max-w-md"
              />
              <p className="text-tiny text-default-400">
                Maximum wait time for user's reply before re-engaging
              </p>
            </div>

            {/* Silence End Call Timeout */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <PhoneOff className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium">
                  Silence End Call ({turn.silence_end_call_timeout === -1 ? "Disabled" : `${turn.silence_end_call_timeout || 0}s`})
                </label>
              </div>
              <Slider
                step={1}
                maxValue={300}
                minValue={-1}
                value={turn.silence_end_call_timeout ?? -1}
                onChange={(value) => onChange("conversation_config.turn.silence_end_call_timeout", value as number)}
                size="sm"
                marks={[
                  { value: -1, label: "Off" },
                  { value: 150, label: "150s" },
                  { value: 300, label: "300s" },
                ]}
                className="max-w-md"
              />
              <p className="text-tiny text-default-400">
                Maximum silence before ending call (-1 to disable)
              </p>
            </div>

            {/* Turn Mode */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Turn Mode</label>
              <RadioGroup
                value={turn.mode || "silence"}
                onValueChange={(value) => onChange("conversation_config.turn.mode", value)}
                orientation="horizontal"
              >
                <Radio value="silence">Silence</Radio>
                <Radio value="turn">Turn</Radio>
              </RadioGroup>
              <p className="text-tiny text-default-400">
                How the agent detects when the user has finished speaking
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
