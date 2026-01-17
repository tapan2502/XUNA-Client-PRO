"use client";

import type { Users, ColumnsKey } from "./data";

import {
  Button,
  RadioGroup,
  Radio,
  User,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@heroui/react";
import React, { useMemo, useEffect, useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { deleteAgent, fetchAgents } from "@/store/agentsSlice";
import { getLanguageFlag } from "@/lib/constants/languages";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import XunaTable, { useMemoizedCallback } from "@/components/hero-ui/XunaTable";

import { columns, INITIAL_VISIBLE_COLUMNS } from "./data";
import { Status } from "./Status";
import { CopyText } from "./copy-text";
import { EyeFilledIcon } from "./eye";
import { EditLinearIcon } from "./edit";
import { DeleteFilledIcon } from "./delete";
import ConfirmationModal from "@/components/ConfirmationModal";
import { CreateAgentModal } from "@/features/agents/components/CreateAgentModal";
import { MoreVertical } from "lucide-react";

interface EnrichedAgent {
  id: string;
  name: string;
  assistantId: string;
  model: string;
  status: string;
  billing: string;
  phoneNumber: string;
  language: { name: string; code: string };
  usage: number;
  usageMax: number;
}

export default function AgentsTable() {
  const [filterValue, setFilterValue] = useState("");
  const [agentToDelete, setAgentToDelete] = React.useState<EnrichedAgent | null>(null);
  const navigator = useNavigate();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [languageFilter, setLanguageFilter] = React.useState("all");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();

  const dispatch = useAppDispatch();
  const { agents, loading } = useAppSelector((s) => s.agents);

  useEffect(() => {
    if (agents.length === 0) {
      dispatch(fetchAgents());
    }
  }, [dispatch, agents.length]);

  const itemFilter = useCallback(
    (col: Users) => {
      const statusMatch = statusFilter === "all" || col.status.toLowerCase() === statusFilter;
      const languageMatch = languageFilter === "all" || col.language.code === languageFilter;
      return statusMatch && languageMatch;
    },
    [statusFilter, languageFilter],
  );

  const enrichedAgents: Users[] = useMemo(() => {
    return (agents || []).map((agent: any) => {
      return {
        id: agent.agent_id,
        name: agent.name || "Untitled Agent",
        assistantId: agent.agent_id,
        model: agent.modelName || "ChatGPT 4o",
        status: agent.status || "inactive",
        statusDot: agent.status || "inactive",
        billing: "stripe",
        phoneNumber: agent.phoneNumber || "None",
        language: {
          name: agent.languageName || "English",
          code: getLanguageFlag(agent.conversation_config?.agent?.language || "en"),
        },
        usage: agent.usage || 0,
        usageMax: agent.usageMax || 100,
      };
    });
  }, [agents]);

  const handleDeletePress = (agent: EnrichedAgent) => {
    setAgentToDelete(agent);
    onOpen();
  };

  const confirmDelete = async () => {
    if (agentToDelete) {
      await dispatch(deleteAgent(agentToDelete.id));
      setAgentToDelete(null);
      onOpenChange();
    }
  };

  const renderCell = useMemoizedCallback((user: Users, columnKey: React.Key) => {
    const userKey = columnKey as ColumnsKey;

    switch (userKey) {
      case "assistantId":
        return <CopyText textClassName="text-default-900">{user.assistantId}</CopyText>;
      case "statusDot":
        return (
          <div className="flex w-full ml-1 items-center justify-center">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                user.status === "active"
                  ? "bg-[#0EFF00] shadow-[0_0_8px_rgba(14,255,0,0.4)]"
                  : "bg-[#FF0000] shadow-[0_0_8px_rgba(255,0,0,0.4)]",
              )}
            />
          </div>
        );
      case "name":
        return (
          <button
            type="button"
            onClick={() => navigator(`/agents/${user.id}`)}
            className="font-semibold text-foreground hover:underline"
          >
            {user.name}
          </button>
        );
      case "model":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: "https://i.pravatar.cc/150?u=" + user.id,
              size: "sm",
              className: "w-8 h-8 rounded-xl",
            }}
            description={<span className="text-sm text-default-400">{user.model}</span>}
            name={<span className="font-semibold text-foreground">{user.name}</span>}
            classNames={{
              base: "gap-3",
              name: "leading-tight",
              description: "leading-tight",
            }}
          />
        );
      case "status":
        {
          const statusMap: Record<string, "Active" | "Paused" | "Inactive"> = {
            active: "Active",
            paused: "Paused",
            inactive: "Inactive",
            "needs work": "Inactive",
          };

          return <Status status={statusMap[user.status.toLowerCase()] || "Inactive"} />;
        }
      case "billing":
        return (
          <span className="text-primary font-bold text-lg">
            stripe
          </span>
        );
      case "phoneNumber":
        return (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full overflow-hidden">
              <img
                src="https://flagcdn.com/w20/us.png"
                className="w-full h-full object-cover"
                alt="US"
              />
            </div>
            <span className="text-foreground font-medium">{user.phoneNumber}</span>
          </div>
        );
      case "services":
        return (
          <div className="flex items-center gap-1">
            <div className="text-xs bg-default-100 dark:bg-default text-white px-2 py-0.5 rounded-full font-semibold uppercase tracking-tight border border-divider">
              Voice
            </div>
          </div>
        );
      case "usageLang":
        return (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full overflow-hidden">
              <img
                src={`https://flagcdn.com/w20/${user.language.code}.png`}
                className="w-full h-full object-cover"
                alt={user.language.name}
              />
            </div>
            <span className="text-foreground font-semibold tracking-tight">{user.language.name}</span>
          </div>
        );
      case "usage":
        {
          const usagePercent = Math.min((user.usage / user.usageMax) * 100, 100);

          return (
            <div className="flex flex-col gap-1.5 w-[110px]">
              <div className="w-full h-3 bg-transparent rounded-full overflow-hidden border border-divider">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    usagePercent > 80 ? "bg-danger" : usagePercent > 50 ? "bg-warning" : "bg-success",
                  )}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-default-400 font-bold tracking-tight">
                  {user.usage.toLocaleString()} of {user.usageMax.toLocaleString()} minutes
                </span>
              </div>
            </div>
          );
        }
      case "actions":
        return (
          <div className="flex items-center justify-end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <MoreVertical size={18} />
              </DropdownTrigger>
              <DropdownMenu aria-label="Agent Actions">
                <DropdownItem
                  key="view"
                  startContent={<EyeFilledIcon size={16} />}
                  onPress={() => navigator(`/agents/${user.id}`)}
                >
                  View Details
                </DropdownItem>
                <DropdownItem key="edit" startContent={<EditLinearIcon size={16} />}>
                  Edit Agent
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<DeleteFilledIcon size={16} />}
                  onPress={() => handleDeletePress(user)}
                >
                  Delete Agent
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return String(user[userKey as keyof Users]);
    }
  });

  if (loading && agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <XunaTable
        columns={columns}
        data={enrichedAgents}
        renderCell={renderCell}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        searchPlaceholder="Search"
        searchKeys={["name", "assistantId", "model", "phoneNumber"]}
        topBarTitle="Agents"
        topBarCount={enrichedAgents.length}
        topBarAction={
          <Button
            className="text-white"
            color="primary"
            endContent={<Icon icon="solar:add-circle-bold" width={20} />}
            onPress={onCreateModalOpen}
          >
            Add Agent
          </Button>
        }
        emptyContent="No agents found"
        filterContent={
          <div className="flex w-full flex-col gap-6">
            <RadioGroup label="Status" value={statusFilter} onValueChange={setStatusFilter} size="sm">
              <Radio value="all">All</Radio>
              <Radio value="active">Active</Radio>
              <Radio value="inactive">Inactive</Radio>
              <Radio value="paused">Paused</Radio>
            </RadioGroup>
            <RadioGroup label="Language" value={languageFilter} onValueChange={setLanguageFilter} size="sm">
              <Radio value="all">All Languages</Radio>
              <Radio value="us">English</Radio>
              <Radio value="da">Danish</Radio>
              <Radio value="de">German</Radio>
              <Radio value="es">Spanish</Radio>
            </RadioGroup>
          </div>
        }
        onItemFilter={itemFilter}
        sortableColumnKey="name"
        rowsPerPage={10}
        ariaLabel="Agents table"
        justifyEndColumns={false}
      />

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => onOpenChange()}
        onConfirm={confirmDelete}
        title="Delete Agent"
        message={`Are you sure you want to delete ${agentToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        isDangerous={true}
        isLoading={false}
      />

      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        onSuccess={() => {
          onCreateModalClose();
          dispatch(fetchAgents());
        }}
      />
    </div>
  );
}
