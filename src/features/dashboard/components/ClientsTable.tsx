"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchAgents } from "@/store/agentsSlice";
import { useNavigate } from "react-router-dom";
import { getLanguageFlag } from "@/lib/constants/languages";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import DataTable, { DataTableColumn, useMemoizedCallback } from "@/components/hero-ui/DataTable";
import { User, Chip, Button, RadioGroup, Radio, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useButton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, cn } from "@heroui/react";
import { MoreVertical, Copy, Check, Eye, Trash2 } from "lucide-react";
import { Icon } from "@iconify/react";
import React from "react";
import { deleteAgent, updateAgentStatus } from "@/store/agentsSlice";
import ConfirmationModal from "@/components/ConfirmationModal";
import { CreateAgentModal } from "@/features/agents/components/CreateAgentModal";
import { useSearchParams } from "react-router-dom";

// Data enrichment utilities
const getRandomPhone = () =>
  `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;

const getRandomLanguage = () => {
  const langs = [
    { name: "English", code: "us" },
    { name: "German", code: "de" },
    { name: "Spanish", code: "es" },
    { name: "Mandarin", code: "cn" },
    { name: "Portuguese", code: "pt" },
  ];
  return langs[Math.floor(Math.random() * langs.length)];
};

const getRandomUsage = () => Math.floor(Math.random() * 6000);

const getRandomModelUser = () => {
  const models = ["Tony Reichert", "Zoe Lang", "Jane Fisher", "William Howard", "Kristen Copper"];
  return models[Math.floor(Math.random() * models.length)];
};

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
type StatusOptions = "active" | "paused" | "inactive";

// Table columns configuration
const columns: DataTableColumn[] = [
  { uid: "name", name: "Client", sortable: true },
  { uid: "assistantId", name: "Assistant ID" },
  { uid: "model", name: "Model" },
  { uid: "status", name: "Status", sortable: true },
  { uid: "billing", name: "Billing" },
  { uid: "phoneNumber", name: "Phone Number" },
  { uid: "services", name: "Services" },
  { uid: "usageLang", name: "Language" },
  { uid: "usage", name: "Usage", sortable: true },
  { uid: "actions", name: "" },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "assistantId", "model", "status", "billing", "phoneNumber", "services", "usageLang", "usage", "actions"];

// CopyText Component
function CopyText({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-[11px] text-default-500 bg-default-50 px-2 py-0.5 rounded-lg border border-default-100 flex items-center min-w-[100px]">
        {children.length > 10 ? `${children.substring(0, 10)}...` : children}
      </span>
      <button
        onClick={handleCopy}
        className="text-default-400 hover:text-primary transition-colors pr-1"
      >
        {copied ? (
          <Check className="text-success" size={14} />
        ) : (
          <Copy size={14} />
        )}
      </button>
    </div>
  );
}

// Status Component
function Status({ status }: { status: string }) {
  const config: Record<string, { bg: string, dot: string, label: string }> = {
    active: { bg: "bg-success-50", dot: "bg-success", label: "Active" },
    paused: { bg: "bg-danger-50", dot: "bg-danger", label: "Paused" },
    inactive: { bg: "bg-default-100", dot: "bg-default-400", label: "Inactive" },
    "needs work": { bg: "bg-warning-50", dot: "bg-warning", label: "Needs Work" },
  };

  const item = config[status.toLowerCase()] || config.inactive;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${item.bg} border border-white dark:border-default-100`}>
      <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
      <span className="text-[11px] text-foreground font-bold whitespace-nowrap">
        {item.label}
      </span>
    </div>
  );
}

// Icons
const EyeFilledIcon = (props: any) => (
  <Eye {...props} size={18} />
);

const EditLinearIcon = (props: any) => (
  <Icon {...props} icon="solar:pen-linear" />
);

const DeleteFilledIcon = (props: any) => (
  <Trash2 {...props} size={18} />
);

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
    dispatch(fetchAgents());
  }, [dispatch]);

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
    const cellValue = user[userKey as unknown as keyof EnrichedAgent];

    switch (userKey) {
      case "assistantId":
        return <CopyText>{String(cellValue)}</CopyText>;
      case "name":
        return (
          <div className="flex items-center gap-6">
            <div className={cn(
              "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]",
              user.status === "active" ? "bg-success" : 
              user.status === "paused" ? "bg-danger" : "bg-warning"
            )} />
            <span className="text-[13px] font-bold text-foreground">{user.name}</span>
          </div>
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
              <span className="text-[10px] text-default-400">ChatGPT 4o</span>
            }
            name={
              <span className="text-[12px] font-bold text-foreground">
                {String(user.model)}
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
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-default-50 border border-default-100 w-fit">
             <div className={cn(
               "w-1.5 h-1.5 rounded-full",
               user.status === "active" ? "bg-success" : 
               user.status === "paused" ? "bg-danger" : "bg-warning"
             )} />
             <span className={cn(
               "text-[11px] font-bold capitalize",
               user.status === "active" ? "text-success" : 
               user.status === "paused" ? "text-danger" : "text-warning"
             )}>
               {user.status === "active" ? "Active" : user.status === "paused" ? "Paused" : "Needs Work"}
             </span>
          </div>
        );
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
          <div className="flex justify-end pr-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" className="text-default-500 hover:text-foreground">
                  <MoreVertical size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Agent Actions">
                <DropdownItem 
                  key="view" 
                  startContent={<Eye size={18} />}
                  onPress={() => navigate(`/agents/${user.id}`)}
                >
                  View Details
                </DropdownItem>
                <DropdownItem 
                  key="delete" 
                  className="text-danger" 
                  color="danger" 
                  startContent={<Trash2 size={18} />} 
                  onPress={() => handleDeletePress(user)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return String(cellValue);
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
      <DataTable<EnrichedAgent>
        columns={columns}
        data={enrichedAgents}
        renderCell={renderCell}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        searchPlaceholder="Search"
        searchKeys={["name", "assistantId", "model"]}
        topBarTitle="Agents"
        topBarCount={enrichedAgents.length}
        topBarAction={
          <Button 
            color="primary" 
            endContent={<Icon icon="solar:add-circle-bold" width={20} />}
            className="font-bold px-4 shadow-lg shadow-primary/20 h-9"
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
        sortableColumnKey="name"
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
