"use client";

import React from "react";
import {Chip} from "@heroui/react";
import {Icon} from "@iconify/react";

import {type SidebarItem, SidebarItemType} from "./Sidebar";
import TeamAvatar from "./team-avatar";

/**
 * Please check the https://heroui.com/docs/guide/routing to have a seamless router integration
 */

export const items: SidebarItem[] = [
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

export const sectionItems: SidebarItem[] = [
  {
    key: "overview",
    title: "Overview",
    items: items,
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
];

export const sectionItemsWithTeams: SidebarItem[] = [
  ...sectionItems,
];

export const brandItems: SidebarItem[] = items;

export const sectionLongList: SidebarItem[] = [
  ...sectionItems,
];

export const sectionNestedItems: SidebarItem[] = items;
