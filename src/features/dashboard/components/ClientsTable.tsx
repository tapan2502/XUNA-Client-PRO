"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchAgents } from "@/store/agentsSlice";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import DataTable, { DataTableColumn, useMemoizedCallback } from "@/components/hero-ui/DataTable";
import { User, Chip, Button, RadioGroup, Radio, DropdownItem, useButton } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

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
  modelUser: string;
  status: string;
  billing: string;
  phoneNumber: string;
  language: { name: string; code: string };
  usage: number;
  usageMax: number;
}

type ColumnsKey = "name" | "assistantId" | "model" | "status" | "billing" | "phoneNumber" | "language" | "usage" | "actions";
type StatusOptions = "active" | "paused" | "inactive";

// Table columns configuration
const columns: DataTableColumn[] = [
  { uid: "name", name: "Client", sortable: true },
  { uid: "assistantId", name: "Assistant ID" },
  { uid: "model", name: "Model" },
  { uid: "status", name: "Status", sortable: true },
  { uid: "billing", name: "Billing" },
  { uid: "phoneNumber", name: "Phone Number" },
  { uid: "language", name: "Language" },
  { uid: "usage", name: "Usage", sortable: true },
  { uid: "actions", name: "Actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "assistantId", "model", "status", "billing", "phoneNumber", "language", "usage", "actions"];

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
      <span className="font-mono text-xs bg-default-100 px-1.5 py-0.5 rounded border border-default-200">
        {children.length > 12 ? `${children.substring(0, 12)}...` : children}
      </span>
      <button
        onClick={handleCopy}
        className="text-default-400 hover:text-default-600 transition-colors"
      >
        {copied ? (
          <Icon icon="solar:check-circle-bold" width={14} />
        ) : (
          <Icon icon="solar:copy-linear" width={14} />
        )}
      </button>
    </div>
  );
}

// Status Component
function Status({ status }: { status: StatusOptions }) {
  const colorMap = {
    active: "success" as const,
    paused: "warning" as const,
    inactive: "danger" as const,
  };

  return (
    <Chip
      classNames={{
        content: "font-medium capitalize",
      }}
      color={colorMap[status]}
      size="sm"
      variant="flat"
    >
      {status}
    </Chip>
  );
}

// Icons
const EyeFilledIcon = (props: any) => (
  <Icon {...props} icon="solar:eye-bold" />
);

const EditLinearIcon = (props: any) => (
  <Icon {...props} icon="solar:pen-linear" />
);

const DeleteFilledIcon = (props: any) => (
  <Icon {...props} icon="solar:trash-bin-trash-bold" />
);

export default function ClientsTable() {
  const [statusFilter, setStatusFilter] = React.useState("all");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { agents, loading } = useAppSelector((s) => s.agents);

  const eyesRef = React.useRef<HTMLButtonElement | null>(null);
  const editRef = React.useRef<HTMLButtonElement | null>(null);
  const deleteRef = React.useRef<HTMLButtonElement | null>(null);
  const { getButtonProps: getEyesProps } = useButton({ ref: eyesRef });
  const { getButtonProps: getEditProps } = useButton({ ref: editRef });
  const { getButtonProps: getDeleteProps } = useButton({ ref: deleteRef });

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  const enrichedAgents: EnrichedAgent[] = useMemo(() => {
    return (agents || []).map((agent: any) => {
      const modelUser = getRandomModelUser();

      return {
        id: agent.agent_id,
        name: agent.name || "Untitled Agent",
        assistantId: agent.agent_id,
        model: "ChatGPT 4o",
        modelUser: modelUser,
        status: ["active", "paused", "inactive"][Math.floor(Math.random() * 3)] as StatusOptions,
        billing: "stripe",
        phoneNumber: getRandomPhone(),
        language: getRandomLanguage(),
        usage: getRandomUsage(),
        usageMax: 6000,
      };
    });
  }, [agents]);

  const itemFilter = useCallback(
    (col: EnrichedAgent) => {
      let allStatus = statusFilter === "all";
      return allStatus || statusFilter === col.status.toLowerCase();
    },
    [statusFilter],
  );

  const renderCell = useMemoizedCallback((user: EnrichedAgent, columnKey: React.Key) => {
    const userKey = columnKey as ColumnsKey;
    const cellValue = user[userKey as unknown as keyof EnrichedAgent] as string;

    switch (userKey) {
      case "assistantId":
        return <CopyText>{cellValue}</CopyText>;
      case "name":
        return (
          <span className="text-small text-default-foreground font-semibold">
            {user.name}
          </span>
        );
      case "model":
        return (
          <User
            avatarProps={{ radius: "lg", src: `https://i.pravatar.cc/150?u=${user.modelUser}` }}
            classNames={{
              name: "text-default-foreground",
              description: "text-default-500",
            }}
            description={user.model}
            name={user.modelUser}
          >
            {user.modelUser}
          </User>
        );
      case "phoneNumber":
        return (
          <div className="flex items-center gap-2">
            <img
              alt="US Flag"
              className="w-5 h-3.5 object-cover rounded-sm"
              src="https://flagcdn.com/us.svg"
            />
            <p className="text-small text-default-foreground text-nowrap">{user.phoneNumber}</p>
          </div>
        );
      case "language":
        return (
          <div className="flex items-center gap-2">
            <img
              alt={user.language.name}
              className="w-5 h-3.5 object-cover rounded-sm"
              src={`https://flagcdn.com/${user.language.code}.svg`}
            />
            <p className="text-small text-default-foreground text-nowrap">{user.language.name}</p>
          </div>
        );
      case "billing":
        return (
          <Chip className="capitalize" color="primary" size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "status":
        return <Status status={cellValue as StatusOptions} />;
      case "usage":
        return (
          <div className="flex flex-col gap-1 w-32">
            <div className="h-1.5 w-full bg-default-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  user.usage > 5000
                    ? "bg-danger"
                    : user.usage > 3000
                    ? "bg-warning"
                    : "bg-success"
                }`}
                style={{ width: `${(user.usage / user.usageMax) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-default-500">
              {user.usage.toLocaleString()} / {user.usageMax.toLocaleString()} min
            </span>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <EyeFilledIcon
              {...getEyesProps()}
              className="text-default-400 cursor-pointer"
              height={18}
              width={18}
            />
            <EditLinearIcon
              {...getEditProps()}
              className="text-default-400 cursor-pointer"
              height={18}
              width={18}
            />
            <DeleteFilledIcon
              {...getDeleteProps()}
              className="text-default-400 cursor-pointer"
              height={18}
              width={18}
            />
          </div>
        );
      default:
        return cellValue;
    }
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DataTable<EnrichedAgent>
      columns={columns}
      data={enrichedAgents}
      renderCell={renderCell}
      initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
      searchPlaceholder="Search"
      searchKeys={["name", "assistantId", "modelUser"]}
      topBarTitle="Team Members"
      topBarCount={enrichedAgents.length}
      topBarAction={
        <Button color="primary" endContent={<Icon icon="solar:add-circle-bold" width={20} />}>
          Add Member
        </Button>
      }
      emptyContent="No agents found"
      filterContent={
        <RadioGroup label="Status" value={statusFilter} onValueChange={setStatusFilter}>
          <Radio value="all">All</Radio>
          <Radio value="active">Active</Radio>
          <Radio value="inactive">Inactive</Radio>
          <Radio value="paused">Paused</Radio>
        </RadioGroup>
      }
      selectedActionsContent={
        <>
          <DropdownItem key="send-email">Send email</DropdownItem>
          <DropdownItem key="bulk-edit">Bulk edit</DropdownItem>
          <DropdownItem key="delete">Delete</DropdownItem>
        </>
      }
      onItemFilter={itemFilter}
      sortableColumnKey="name"
      ariaLabel="Agents table with custom cells, pagination and sorting"
    />
  );
}
