import { DangerCircleSvg } from "./danger-circle";
import { DefaultCircleSvg } from "./default-circle";
import { SuccessCircleSvg } from "./success-circle";
import { WarningCircleSvg } from "./warning-circle";
import type { XunaTableColumn } from "@/components/hero-ui/XunaTable";

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
  { name: "Paused", uid: "paused" },
] as const;

export type StatusOptions = (typeof statusOptions)[number]["name"];

export const statusColorMap: Record<StatusOptions, JSX.Element> = {
  Active: SuccessCircleSvg,
  Inactive: DefaultCircleSvg,
  Paused: DangerCircleSvg,
};

export type Users = {
  id: string;
  name: string;
  assistantId: string;
  model: string;
  status: string;
  statusDot: string;
  billing: string;
  phoneNumber: string;
  language: { name: string; code: string };
  usage: number;
  usageMax: number;
};

export type ColumnsKey =
  | "statusDot"
  | "name"
  | "assistantId"
  | "model"
  | "status"
  | "billing"
  | "phoneNumber"
  | "services"
  | "usageLang"
  | "usage"
  | "actions";

export const INITIAL_VISIBLE_COLUMNS: ColumnsKey[] = [
  "statusDot",
  "name",
  "assistantId",
  "model",
  "status",
  "billing",
  "phoneNumber",
  "services",
  "usageLang",
  "usage",
  "actions",
];

export const columns: XunaTableColumn[] = [
  {
    uid: "statusDot",
    name: (
      <div className="flex items-center justify-center w-full ml-1">
        <div className="w-2 h-2 rounded-full bg-success" />
      </div>
    ),
    sortDirection: "ascending",
  },
  { uid: "name", name: "Agent", sortDirection: "ascending", sortable: true },
  {
    uid: "assistantId",
    name: "Assistant ID",
    info: "Assistant ID is a unique identifier for each agent assistant.",
  },
  { uid: "model", name: "Model" },
  { uid: "status", name: "Status", sortable: true },
  { uid: "billing", name: "Billing" },
  { uid: "phoneNumber", name: "Phone Number" },
  { uid: "services", name: "Services", sortable: true },
  { uid: "usageLang", name: "Language", sortable: true },
  { uid: "usage", name: "Usage", sortable: true },
  { uid: "actions", name: "Actions" },
];

const agentNames = [
  "Customer Support Agent",
  "Sales Assistant",
  "Technical Support Bot",
  "Marketing Agent",
  "Order Processing Agent",
  "Appointment Scheduler",
  "FAQ Agent",
  "Lead Qualification Bot",
  "Feedback Collector",
  "Product Recommender",
];

const models = [
  "ChatGPT 4o",
  "ChatGPT 4o-mini",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "GPT-4 Turbo",
];

const languages = [
  { name: "English", code: "us" },
  { name: "Danish", code: "da" },
  { name: "German", code: "de" },
  { name: "Spanish", code: "es" },
];

const generateMockAgentData = (count: number): Users[] => {
  const mockData: Users[] = [];

  for (let i = 0; i < count; i++) {
    const selectedName = agentNames[Math.floor(Math.random() * agentNames.length)];
    const selectedModel = models[Math.floor(Math.random() * models.length)];
    const selectedLanguage = languages[Math.floor(Math.random() * languages.length)];
    const randomUsage = Math.floor(Math.random() * 100);
    const randomStatus = Math.random() > 0.5 ? "active" : Math.random() > 0.5 ? "paused" : "inactive";

    const agent: Users = {
      id: `agent-${i}`,
      name: selectedName,
      assistantId: `asst_${Math.random().toString(36).substring(2, 15)}`,
      model: selectedModel,
      status: randomStatus,
      statusDot: randomStatus,
      billing: "stripe",
      phoneNumber: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      language: selectedLanguage,
      usage: randomUsage,
      usageMax: 100,
    };

    mockData.push(agent);
  }

  return mockData;
};

export const users: Users[] = generateMockAgentData(50);
