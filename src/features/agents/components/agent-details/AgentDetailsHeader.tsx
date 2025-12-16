"use client"

import { ArrowLeft, Bot } from "lucide-react"
import { Button, Card, CardBody, Chip } from "@heroui/react"

interface AgentDetailsHeaderProps {
  agent: any
  onBack: () => void
}

export function AgentDetailsHeader({ agent, onBack }: AgentDetailsHeaderProps) {
  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="p-6 flex flex-row items-center gap-6">
        <Button
          isIconOnly
          variant="flat"
          onPress={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-5 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">{agent.name}</h1>
            <Chip variant="flat" size="sm" className="font-mono">
              {agent.agent_id}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
