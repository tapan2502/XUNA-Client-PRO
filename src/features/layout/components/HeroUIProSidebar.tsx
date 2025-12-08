"use client";

import type { SidebarItem } from "@/components/hero-ui/HeroSidebar";

import React from "react";
import {
  ScrollShadow,
  Select,
  SelectItem,
  Input,
  Spacer,
  SelectSection,
  Button,
  User as HeroUser,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentUserData, fetchUserDetails, logout } from "@/store/authSlice";
import { auth } from "@/lib/firebase";

import HeroSidebar from "@/components/hero-ui/HeroSidebar";

// App Icon component  
const AppIcon = () => (
  <svg
    className="text-primary"
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    width="32"
  >
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

// Sidebar navigation items matching Figma
const sidebarItems: SidebarItem[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: "solar:home-2-linear",
    title: "Dashboard",
  },
  {
    key: "phone-numbers",
    href: "/dashboard/phone-numbers",
    icon: "solar:phone-linear",
    title: "Phone Numbers",
  },
  {
    key: "assistants",
    href: "/dashboard/assistants",
    icon: "solar:widget-2-outline",
    title: "Assistants",
  },
  {
    key: "knowledge-base",
    href: "/dashboard/knowledge-base",
    icon: "solar:book-outline",
    title: "Knowledge Base",
  },
  {
    key: "tools",
    href: "/dashboard/tools",
    icon: "solar:settings-outline",
    title: "Tools & Functions",
  },
  {
    key: "campaigns",
    href: "/dashboard/campaigns",
    icon: "solar:megaphone-linear",
    title: "Campaigns",
  },
  {
    key: "contacts",
    href: "/dashboard/contacts",
    icon: "solar:users-group-rounded-linear",
    title: "Contacts",
  },
  {
    key: "automation",
    href: "/dashboard/automation",
    icon: "solar:widget-5-linear",
    title: "Automation",
  },
  {
    key: "call-logs",
    href: "/dashboard/call-history",
    icon: "solar:headphones-round-linear",
    title: "Call Logs",
  },
];

const configItems: SidebarItem[] = [
  {
    key: "api-keys",
    href: "/dashboard/api-keys",
    icon: "solar:key-linear",
    title: "API Keys",
  },
  {
    key: "voice-providers",
    href: "/dashboard/voice-providers",
    icon: "solar:microphone-linear",
    title: "Voice API Providers",
  },
  {
    key: "settings",
    href: "/dashboard/settings",
    icon: "solar:settings-linear",
    title: "Settings",
  },
];

// Workspace configuration
const workspaces = [
  {
    value: "0",
    label: "XUNA AI",
    items: [
      {
        value: "1",
        label: "Core workspace",
      },
      {
        value: "2",
        label: "Development workspace",
      },
    ],
  },
];

export default function HeroUIProSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const userData = useAppSelector(selectCurrentUserData);
  const [countryCode, setCountryCode] = React.useState("+1");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  // Fetch user data if not loaded
  React.useEffect(() => {
    if (auth.currentUser && !userData) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, userData]);

  const displayName = userData?.name || "Kate Moore";
  const userRole = userData?.role === "super-admin" ? "Admin" : "Customer Support";

  // Get current path for active state
  const currentPath = React.useMemo(() => {
    const path = location.pathname;
    const allItems = [...sidebarItems, ...configItems];
    const match = allItems.find(item => item.href === path);
    return match?.key || "dashboard";
  }, [location.pathname]);

  const handleSelect = React.useCallback((key: string) => {
    const allItems = [...sidebarItems, ...configItems];
    const item = allItems.find(i => i.key === key);
    if (item?.href) {
      navigate(item.href);
    }
  }, [navigate]);

const handleCall = () => {
    console.log(`Calling ${countryCode} ${phoneNumber}`);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="h-full">
      <div className="border-r border-divider relative flex h-full w-64 flex-1 flex-col px-3 py-4 bg-background">
        {/* Workspace Selector - Matching Figma exactly */}
        <div className="mb-4">
          <Select
            disableSelectorIconRotation
            aria-label="Select workspace"
            classNames={{
              trigger: "h-14 bg-background border border-default-200 rounded-2xl px-3",
              value: "text-sm",
              innerWrapper: "gap-2",
              selectorIcon: "text-default-400"
            }}
            defaultSelectedKeys={["1"]}
            items={workspaces}
            placeholder="Select workspace"
            renderValue={(items) => {
              return items.map((item) => (
                <div key={item.key} className="flex flex-col gap-0 items-start">
                  <span className="text-sm font-semibold text-foreground">Xuna AI</span>
                  <span className="text-xs text-default-400">{item.data?.label}</span>
                </div>
              ));
            }}
            selectorIcon={
              <Icon className="text-default-400" icon="lucide:chevrons-up-down" width={14} />
            }
            startContent={
              <div className="relative h-9 w-9 flex-none rounded-full border border-default-200 flex items-center justify-center bg-background">
                <Icon className="text-default-400" icon="solar:users-group-rounded-linear" width={18} />
              </div>
            }
          >
            {(section) => (
              <SelectSection
                key={section.value}
                hideSelectedIcon
                showDivider
                aria-label={section.label}
                items={section.items}
                title={section.label}
              >
                {/* @ts-ignore */}
                {(item) => (
                  <SelectItem key={item.value} aria-label={item.label} textValue={item.label}>
                    <div className="flex flex-row items-center justify-between gap-1">
                      <span>{item.label}</span>
                    </div>
                  </SelectItem>
                )}
              </SelectSection>
            )}
          </Select>
        </div>

        {/* Sidebar Navigation - Simple like Figma */}
        <ScrollShadow className="-mr-3 h-full max-h-full pr-3">
          <HeroSidebar
            defaultSelectedKey={currentPath}
            iconClassName="text-default-500 w-5 h-5"
            itemClasses={{
              base: "px-3 py-2.5 rounded-xl data-[selected=true]:bg-default-100 data-[hover=true]:bg-default-50 mb-0.5",
              title: "text-sm text-foreground",
            }}
            items={sidebarItems}
            onSelect={handleSelect}
          />
          
          <Spacer y={4} />
          <div className="px-3 mb-1">
            <p className="text-xs text-default-400">Configuration</p>
          </div>
          
          <HeroSidebar
            defaultSelectedKey={currentPath}
            iconClassName="text-default-500 w-5 h-5"
            itemClasses={{
              base: "px-3 py-2.5 rounded-xl data-[selected=true]:bg-default-100 data-[hover=true]:bg-default-50 mb-0.5",
              title: "text-sm text-foreground",
            }}
            items={configItems}
            onSelect={handleSelect}
          />
        </ScrollShadow>

        {/* Schedule a Call Section - Bordered card like Figma */}
        <div className="mt-auto">
          <div className="rounded-2xl p-4 border border-default-200 bg-background">
            <p className="text-sm text-foreground font-medium mb-3 text-center">Schedule a Call</p>
            <div className="flex items-center border border-default-200 rounded-lg overflow-hidden mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-2 border-r border-default-200 bg-background">
                <span className="text-base">🇺🇸</span>
                <span className="text-sm text-foreground">+1</span>
              </div>
              <Input
                aria-label="Phone number"
                className="flex-1"
                classNames={{
                  inputWrapper: "h-9 bg-transparent border-none shadow-none",
                  input: "text-sm",
                }}
                placeholder=""
                size="sm"
                type="tel"
                value={phoneNumber}
                onValueChange={setPhoneNumber}
              />
            </div>
            <Button
              className="w-full rounded-xl font-medium"
              color="primary"
              size="md"
              onPress={handleCall}
            >
              Call Me
            </Button>
          </div>
        </div>

        <Spacer y={3} />

        {/* User Profile at Bottom - Simple row like Figma */}
        <Dropdown placement="top">
          <DropdownTrigger>
            <div className="flex items-center justify-between cursor-pointer hover:bg-default-50 rounded-lg p-2 -mx-1 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar
                  size="sm"
                  className="w-9 h-9"
                  src="https://i.pravatar.cc/150?u=kate"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Kate Moore</span>
                  <span className="text-xs text-default-400">Customer Support</span>
                </div>
              </div>
              <Icon className="text-default-400" icon="lucide:chevrons-up-down" width={14} />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User menu" variant="flat">
            <DropdownSection showDivider aria-label="Profile & Actions">
              <DropdownItem
                key="profile"
                isReadOnly
                className="h-14 gap-2 opacity-100"
                textValue="Signed in as"
              >
                <HeroUser
                  avatarProps={{
                    size: "sm",
                    src: "https://i.pravatar.cc/150?u=kate",
                  }}
                  classNames={{
                    name: "text-default-600",
                    description: "text-default-500",
                  }}
                  description={userRole}
                  name={displayName}
                />
              </DropdownItem>
              <DropdownItem key="dashboard" onClick={() => navigate("/dashboard")}>
                Dashboard
              </DropdownItem>
              <DropdownItem key="settings" onClick={() => navigate("/dashboard/settings")}>
                Settings
              </DropdownItem>
            </DropdownSection>
            <DropdownSection aria-label="Help & Feedback">
              <DropdownItem key="help">Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
