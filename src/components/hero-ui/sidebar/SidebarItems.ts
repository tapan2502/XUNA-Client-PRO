import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";
import { type SidebarItem, SidebarItemType } from "./Sidebar";
import TeamAvatar from "./TeamAvatar";

export const items: SidebarItem[] = [
    {
        key: "dashboard",
        href: "/dashboard",
        icon: "solar:widget-5-linear",
        title: "Agents",
    },
    {
        key: "phone-numbers",
        href: "/dashboard/phone-numbers",
        icon: "solar:phone-linear",
        title: "Phone Numbers",
    },
    {
        key: "knowledge-base",
        href: "/dashboard/knowledge-base",
        icon: "solar:notebook-linear",
        title: "Knowledge Base",
    },
    {
        key: "campaigns",
        href: "/dashboard/campaigns",
        icon: "solar:plain-2-linear",
        title: "Campaigns",
    },
    {
        key: "call-logs",
        href: "/dashboard/call-history",
        icon: "solar:phone-calling-linear",
        title: "Call Logs",
    },
];

export const configurationItems: SidebarItem[] = [
    {
        key: "settings",
        href: "/dashboard/settings",
        icon: "solar:tuning-2-linear",
        title: "Settings",
    },
];

export const sectionItems: SidebarItem[] = [
    {
        key: "main",
        title: "MAIN",
        items: items,
    },
    {
        key: "configuration",
        title: "CONFIGURATION",
        items: configurationItems,
    },
];
