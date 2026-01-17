"use client";
import {type SidebarItem, SidebarItemType} from "./Sidebar";

import {Chip} from "@heroui/react";

import {Icon} from "@iconify/react";

import TeamAvatar from "./team-avatar";

/**
 * Please check the https://heroui.com/docs/guide/routing to have a seamless router integration
 */

export const sectionItems: SidebarItem[] = [  {
    key: "overview",
    title: "Overview",
    items: [
      {
        key: "dashboard",
        href: "#",
        icon: "solar:home-2-linear",
        title: "Dashboard",
      },
      {
        key: "voice",
        href: "#",
        icon: "solar:microphone-large-linear",
        title: "Voice",
        endContent: (
          <Icon className="text-default-400" icon="solar:microphone-large-linear" width={24} />
        ),
      },
      {
        key: "imessage",
        href: "#",
        icon: "solar:chat-dots-linear",
        title: "iMessage",
        endContent: (
          <Icon className="text-default-400" icon="solar:chat-dots-linear" width={24} />
        ),
      },
      {
        key: "chat",
        href: "#",
        icon: "solar:dialog-2-linear",
        title: "Chat",
      },
      {
        key: "leads",
        href: "#",
        icon: "solar:user-id-linear",
        title: "Leads",
        endContent: (
          <Chip size="sm" variant="flat">
            New          </Chip>
        ),
      },
      {
        key: "reviews",
        href: "#",
        icon: "solar:like-linear",
        title: "Reviews",
      },
    ],
  },
  {
    key: "organization",
    title: "Organization",
    items: [
      {
        key: "workflows",
        href: "#",
        icon: "solar:branching-paths-down-linear",
        title: "Workflows",
      },
      {
        key: "integrations",
        href: "#",
        icon: "solar:link-square-linear",
        title: "Integrations",
      },
    ],
  },
  {
    key: "finance",
    title: "Finance",
    items: [
      {
        key: "billing",
        href: "/billing",
        icon: "solar:dollar-minimalistic-linear",
        title: "Billing",
      },
      {
        key: "analytics",
        href: "#",
        icon: "solar:chart-linear",
        title: "Analytics",
      },
      {
        key: "settings",
        href: "/settings",
        icon: "solar:settings-outline",
        title: "Settings",
      },
    ],
  },
];

export const sectionItemsWithTeams: SidebarItem[] = [  ...sectionItems,
  {
    key: "your-teams",
    title: "Your Teams",
    items: [
      {
        key: "xuna-university",
        href: "#",
        title: "XUNA University",
        startContent: <TeamAvatar name="XUNA University" />,
      },
      {
        key: "xuna-news",
        href: "#",
        title: "XUNA News",
        startContent: <TeamAvatar name="XUNA News" />,
      },
      {
        key: "xuna-partners",
        href: "#",
        title: "XUNA Partners",
        startContent: <TeamAvatar name="XUNA Partners" />,
      },
    ],
  },
];

export const xunaItems: SidebarItem[] = [
  {
    key: "agents",
    href: "/agents",
    icon: "solar:users-group-two-rounded-outline",
    title: "Agents",
  },
  {
    key: "phone-numbers",
    href: "/phone-numbers",
    icon: "solar:phone-linear",
    title: "Phone Numbers",
  },
  {
    key: "knowledge-base",
    href: "/knowledge-base",
    icon: "solar:notebook-linear",
    title: "Knowledge Base",
  },
  {
    key: "tools",
    href: "/tools",
    icon: "solar:settings-outline",
    title: "Tools & Functions",
  },
  {
    key: "campaigns",
    href: "/campaigns",
    icon: "solar:plain-2-linear",
    title: "Campaigns",
  },
  {
    key: "call-history",
    href: "/call-history",
    icon: "solar:phone-calling-linear",
    title: "Call Logs",
  },
];

export const xunaSectionItems: SidebarItem[] = [
  {
    key: "overview",
    title: "Overview",
    items: xunaItems,
  },
  {
    key: "configuration",
    title: "Configuration",
    items: [
      {
        key: "settings",
        href: "/settings",
        icon: "solar:tuning-2-linear",
        title: "Settings",
      },
    ],
  },
  {
    key: "finance",
    title: "Finance",
    items: [
      {
        key: "billing",
        href: "/billing",
        icon: "solar:dollar-minimalistic-linear",
        title: "Billing",
      },
    ],
  },
];

export const compactSidebarItems: SidebarItem[] = [
  ...sectionItems,
];
