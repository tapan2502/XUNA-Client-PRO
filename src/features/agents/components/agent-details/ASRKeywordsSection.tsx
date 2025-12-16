"use client"

import { useState } from "react"
import { Card, CardBody, Input, Button, Chip } from "@heroui/react"
import { Mic, Plus, X } from "lucide-react"

interface ASRKeywordsSectionProps {
  agent: any
  onChange: (path: string, value: any) => void
}

export function ASRKeywordsSection({ agent, onChange }: ASRKeywordsSectionProps) {
  const [newKeyword, setNewKeyword] = useState("")
  const keywords = agent.conversation_config?.asr?.keywords || []

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      onChange("conversation_config.asr.keywords", [...keywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    onChange(
      "conversation_config.asr.keywords",
      keywords.filter((k: string) => k !== keyword)
    )
  }

  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-default-700">ASR Keywords</h3>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newKeyword}
            onValueChange={setNewKeyword}
            placeholder="Add keyword..."
            variant="bordered"
            size="sm"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddKeyword()
              }
            }}
          />
          <Button
            isIconOnly
            size="sm"
            color="primary"
            variant="flat"
            onPress={handleAddKeyword}
          >
            <Plus size={16} />
          </Button>
        </div>

        {keywords.length === 0 ? (
          <p className="text-small text-default-400">No keywords configured</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword: string) => (
              <Chip
                key={keyword}
                variant="flat"
                size="sm"
                color="primary"
                onClose={() => handleRemoveKeyword(keyword)}
              >
                {keyword}
              </Chip>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
