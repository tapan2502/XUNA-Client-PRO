import { useState, useEffect, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchAgents } from "@/store/agentsSlice";
import { useNavigate } from "react-router-dom";
import { getLanguageFlag } from "@/lib/constants/languages";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import PremiumTable, { PremiumTableColumn } from "@/components/hero-ui/premium-table/PremiumTable";
import { useMemoizedCallback } from "@/components/hero-ui/premium-table/use-memoized-callback";
import { User, Button, RadioGroup, Radio, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure, cn, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";
import { deleteAgent } from "@/store/agentsSlice";
import ConfirmationModal from "@/components/ConfirmationModal";
import { CreateAgentModal } from "@/features/agents/components/CreateAgentModal";
import { useSearchParams } from "react-router-dom";
import { CopyText } from "@/components/hero-ui/premium-table/copy-text";
import { Status } from "@/components/hero-ui/premium-table/status";
import { EyeFilledIcon, EditLinearIcon, DeleteFilledIcon } from "@/components/hero-ui/premium-table/icons";

// Data enrichment utilities
const getRandomPhone = () =>
  `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;

// Types
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

type ColumnsKey = "name" | "assistantId" | "model" | "status" | "billing" | "phoneNumber" | "services" | "usageLang" | "usage" | "actions";

// Table columns configuration
const columns: PremiumTableColumn[] = [
  { 
    uid: "statusDot", 
    name: (
      <div className="flex items-center justify-center w-full">
         <div className="w-2 h-2 rounded-full bg-success" />
      </div>
    ),
    sortable: true 
  },
  { uid: "name", name: "Agent", sortable: true },
  { uid: "assistantId", name: "Assistant ID" },
  { uid: "model", name: "Model" },
  { uid: "status", name: "Status", sortable: true },
  { uid: "billing", name: "Billing" },
  { uid: "phoneNumber", name: "Phone Number" },
  { uid: "services", name: "Services" },
  { uid: "usageLang", name: "Language" },
  { uid: "usage", name: "Usage", sortable: true },
  { uid: "actions", name: "Actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["statusDot", "name", "assistantId", "model", "status", "billing", "phoneNumber", "services", "usageLang", "usage", "actions"];

export default function ClientsTable() {
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [languageFilter, setLanguageFilter] = React.useState("all");
  const [agentToDelete, setAgentToDelete] = React.useState<EnrichedAgent | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { agents, loading } = useAppSelector((s) => s.agents);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { 
    isOpen: isCreateModalOpen, 
    onOpen: onCreateModalOpen, 
    onClose: onCreateModalClose 
  } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      onCreateModalOpen();
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('create');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, onCreateModalOpen, setSearchParams]);

  useEffect(() => {
    if (agents.length === 0) {
      dispatch(fetchAgents());
    }
  }, [dispatch, agents.length]);

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

  const enrichedAgents: EnrichedAgent[] = useMemo(() => {
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
          code: getLanguageFlag(agent.language || "en")
        },
        usage: agent.usage || 0,
        usageMax: agent.usageMax || 100,
      };
    });
  }, [agents]);

  const itemFilter = useCallback(
    (col: EnrichedAgent) => {
      const statusMatch = statusFilter === "all" || col.status.toLowerCase() === statusFilter;
      const languageMatch = languageFilter === "all" || col.language.code === languageFilter;
      return statusMatch && languageMatch;
    },
    [statusFilter, languageFilter],
  );

  const renderCell = useMemoizedCallback((user: EnrichedAgent, columnKey: React.Key) => {
    const userKey = columnKey as ColumnsKey;

    switch (userKey) {
      case "assistantId":
        return <CopyText>{user.assistantId}</CopyText>;
      case "statusDot":
        return (
          <div className={cn(
            "w-2 h-2 rounded-full",
            user.status === "active" ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" : 
            user.status === "paused" ? "bg-danger shadow-[0_0_8px_rgba(243,18,96,0.4)]" : "bg-warning shadow-[0_0_8px_rgba(245,165,36,0.4)]"
          )} />
        );
      case "name":
        return (
          <span className="text-[13px] font-bold text-foreground">{user.name}</span>
        );
      case "model":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: "https://i.pravatar.cc/150?u=" + user.id,
              size: "sm",
              className: "w-8 h-8 rounded-xl"
            }}
            description={
              <span className="text-[10px] text-default-400">{user.model}</span>
            }
            name={
              <span className="text-[12px] font-bold text-foreground">
                {user.name}
              </span>
            }
            classNames={{
              base: "gap-3",
              name: "leading-tight",
              description: "leading-tight",
            }}
          />
        );
      case "status":
        const statusMap: Record<string, "Active" | "Paused" | "Inactive"> = {
          active: "Active",
          paused: "Paused",
          inactive: "Inactive",
          "needs work": "Inactive"
        };
        return <Status status={statusMap[user.status.toLowerCase()] || "Inactive"} />;
      case "billing":
        return (
          <span className="text-primary font-bold text-[12px]">stripe</span>
        );
      case "phoneNumber":
        return (
          <div className="flex items-center gap-2">
            <img src="https://flagcdn.com/w20/us.png" className="w-4 h-3 object-cover rounded-[2px]" alt="US" />
            <span className="text-[12px] text-foreground font-medium">{user.phoneNumber}</span>
          </div>
        );
      case "services":
        return (
          <div className="flex items-center gap-1">
            <div className="text-[10px] bg-default-100 dark:bg-black/40 text-default-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-tight border border-divider">
              Voice
            </div>
          </div>
        );
      case "usageLang":
        return (
          <div className="flex items-center gap-2">
            <img src={`https://flagcdn.com/w20/${user.language.code}.png`} className="w-4 h-3 object-cover rounded-[2px] opacity-80" alt={user.language.name} />
            <span className="text-[12px] text-foreground font-bold tracking-tight">{user.language.name}</span>
          </div>
        );
      case "usage":
        const usagePercent = Math.min((user.usage / user.usageMax) * 100, 100);
        return (
          <div className="flex flex-col gap-1.5 w-[110px]">
            <div className="w-full h-1 bg-default-100 dark:bg-black/40 rounded-full overflow-hidden border border-divider">
               <div 
                 className={cn(
                   "h-full rounded-full transition-all duration-500",
                   usagePercent > 80 ? "bg-danger" : usagePercent > 50 ? "bg-warning" : "bg-success"
                 )} 
                 style={{ width: `${usagePercent}%` }} 
               />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] text-default-400 font-bold tracking-tight">
                {user.usage.toLocaleString()} / {user.usageMax.toLocaleString()}
              </span>
              <span className="text-[8px] text-default-500 font-medium">min</span>
            </div>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" className="text-default-400 w-8 h-8">
                  <Icon icon="solar:menu-dots-bold" className="rotate-90" width={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Agent Actions">
                <DropdownItem 
                  key="view" 
                  startContent={<EyeFilledIcon size={16} />}
                  onPress={() => navigate(`/agents/${user.id}`)}
                >
                  View Details
                </DropdownItem>
                <DropdownItem 
                  key="edit" 
                  startContent={<EditLinearIcon size={16} />}
                >
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
        return String(user[userKey as keyof EnrichedAgent]);
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
    <div className="flex flex-col h-full min-h-0">
      <PremiumTable<EnrichedAgent>
        columns={columns}
        data={enrichedAgents}
        renderCell={renderCell}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        searchPlaceholder="Search agents"
        searchKeys={["name", "assistantId", "model", "phoneNumber"]}
        topBarTitle="Agents"
        topBarCount={enrichedAgents.length}
        topBarAction={
          <Button 
            color="primary" 
            size="md"
            radius="md"
            endContent={
              <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                </svg>
              </div>
            }
            className="px-4 shadow-lg shadow-primary/20 font-normal"
            onPress={onCreateModalOpen}
          >
            Add Agent
          </Button>
        }
        emptyContent="No agents found"
        filterContent={
          <div className="flex flex-col gap-6">
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
        ariaLabel="Agents table with custom cells, pagination and sorting"
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
