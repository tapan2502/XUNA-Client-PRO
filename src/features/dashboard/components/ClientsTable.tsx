"use client"

import { useState } from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  User,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Progress,
} from "@heroui/react"
import { Search, Filter, SortAsc, Columns, MoreVertical, Plus } from "lucide-react"

interface Client {
  id: string
  name: string
  assistantId: string
  model: string
  status: "Active" | "Paused" | "Inactive" | "Needs Work"
  billing: string
  phoneNumber: string
  services: string[]
  language: string
  usage: number
  avatar: string
  assistant: string
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Xuna AI",
    assistantId: "unf48h4f2...",
    model: "ChatGPT 4o",
    status: "Active",
    billing: "stripe",
    phoneNumber: "+1 (813) 123-4567",
    services: ["Voice", "SMS", "Outbound", "Inbound"],
    language: "English",
    usage: 482,
    avatar: "/placeholder-user.jpg",
    assistant: "Tony Reichert",
  },
  {
    id: "2",
    name: "Mokai Agency",
    assistantId: "unf48h4f2...",
    model: "ChatGPT 4o",
    status: "Paused",
    billing: "stripe",
    phoneNumber: "+1 (813) 123-4567",
    services: ["Voice", "Outbound", "Inbound"],
    language: "German",
    usage: 518,
    avatar: "/placeholder-user.jpg",
    assistant: "Zoe Lang",
  },
  {
    id: "3",
    name: "Best Buy",
    assistantId: "unf48h4f2...",
    model: "ChatGPT 4o",
    status: "Needs Work",
    billing: "stripe",
    phoneNumber: "+1 (813) 123-4567",
    services: ["Voice", "Inbound"],
    language: "English",
    usage: 5,
    avatar: "/placeholder-user.jpg",
    assistant: "Jane Fisher",
  },
  {
    id: "4",
    name: "Target",
    assistantId: "unf48h4f2...",
    model: "ChatGPT 4o",
    status: "Active",
    billing: "stripe",
    phoneNumber: "+1 (813) 123-4567",
    services: ["SMS", "Outbound", "Inbound"],
    language: "English",
    usage: 482,
    avatar: "/placeholder-user.jpg",
    assistant: "William Howard",
  },
  {
    id: "5",
    name: "Walmart",
    assistantId: "unf48h4f2...",
    model: "ChatGPT 4o",
    status: "Paused",
    billing: "stripe",
    phoneNumber: "+1 (813) 123-4567",
    services: ["Voice", "Outbound"],
    language: "Spanish",
    usage: 482,
    avatar: "/placeholder-user.jpg",
    assistant: "Kristen Cooper",
  },
]

export default function ClientsTable() {
  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState("")
  const rowsPerPage = 10

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success"
      case "Paused":
        return "warning"
      case "Inactive":
        return "default"
      case "Needs Work":
        return "warning"
      default:
        return "default"
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage >= 400) return "success"
    if (usage >= 200) return "warning"
    return "danger"
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Clients</h2>
          <Chip size="sm" variant="flat">
            100
          </Chip>
        </div>
        <Button color="primary" startContent={<Plus className="size-4" />}>
          Add Client
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          className="max-w-xs"
          placeholder="Search"
          startContent={<Search className="size-4 text-foreground-400" />}
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <Button variant="flat" startContent={<Filter className="size-4" />}>
          Filter
        </Button>
        <Button variant="flat" startContent={<SortAsc className="size-4" />}>
          Sort
        </Button>
        <Button variant="flat" startContent={<Columns className="size-4" />}>
          Columns
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-foreground-500">2 Selected</span>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">Selected Actions</Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>Export</DropdownItem>
              <DropdownItem>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="Clients table"
        classNames={{
          wrapper: "bg-content1",
        }}
      >
        <TableHeader>
          <TableColumn>CLIENT</TableColumn>
          <TableColumn>ASSISTANT ID</TableColumn>
          <TableColumn>MODEL</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>BILLING</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>SERVICES</TableColumn>
          <TableColumn>LANGUAGE</TableColumn>
          <TableColumn>USAGE</TableColumn>
          <TableColumn> </TableColumn>
        </TableHeader>
        <TableBody>
          {mockClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-success" />
                  <span className="font-medium">{client.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-foreground-500">{client.assistantId}</span>
                  <Button isIconOnly size="sm" variant="light">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <User
                  name={client.assistant}
                  description={client.model}
                  avatarProps={{ src: client.avatar, size: "sm" }}
                />
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="dot" color={getStatusColor(client.status)}>
                  {client.status}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-primary font-medium">{client.billing}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm">🇺🇸</span>
                  <span>{client.phoneNumber}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {client.services.map((service) => (
                    <Chip key={service} size="sm" variant="flat">
                      {service}
                    </Chip>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm">🇺🇸</span>
                  <span>{client.language}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 min-w-[120px]">
                  <Progress
                    size="sm"
                    value={(client.usage / 5000) * 100}
                    color={getUsageColor(client.usage)}
                    classNames={{
                      track: "h-1",
                    }}
                  />
                  <span className="text-xs text-foreground-500">{client.usage} of 5,000 minutes</span>
                </div>
              </TableCell>
              <TableCell>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertical className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground-500">2 of 10 selected</span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="flat">
            Previous
          </Button>
          <Pagination total={10} page={page} onChange={setPage} size="sm" />
          <Button size="sm" variant="flat">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
