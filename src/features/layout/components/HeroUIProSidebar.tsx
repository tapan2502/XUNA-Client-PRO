"use client";

import type { SidebarItem } from "@/components/hero-ui/HeroSidebar";

import React from "react";
import {
  ScrollShadow,
  Input,
  Spacer,
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
    icon: "solar:widget-5-linear",
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
    icon: "solar:users-group-rounded-linear",
    title: "Assistants",
  },
  {
    key: "knowledge-base",
    href: "/dashboard/knowledge-base",
    icon: "solar:notebook-linear",
    title: "Knowledge Base",
  },
  {
    key: "tools",
    href: "/dashboard/tools",
    icon: "solar:code-2-linear",
    title: "Tools & Functions",
  },
  {
    key: "campaigns",
    href: "/dashboard/campaigns",
    icon: "solar:plain-2-linear",
    title: "Campaigns",
  },
  {
    key: "contacts",
    href: "/dashboard/contacts",
    icon: "solar:user-rounded-linear",
    title: "Contacts",
  },
  {
    key: "automation",
    href: "/dashboard/automation",
    icon: "solar:infinity-linear",
    title: "Automation",
  },
  {
    key: "call-logs",
    href: "/dashboard/call-history",
    icon: "solar:phone-calling-linear",
    title: "Call Logs",
  },
];

const configItems: SidebarItem[] = [
  {
    key: "api-keys",
    href: "/dashboard/api-keys",
    icon: "solar:key-minimalistic-linear",
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
    icon: "solar:tuning-2-linear",
    title: "Settings",
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
      <div className="border-r border-default-200 relative flex h-full w-[280px] flex-1 flex-col px-5 py-6 bg-background">
        
        {/* Static Workspace Header */}
        <div className="mb-8 flex items-center gap-3 px-3 py-3 border border-default-200 rounded-2xl bg-background hover:bg-default-50 cursor-pointer transition-colors group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-default-100 text-default-500 group-hover:bg-white group-hover:shadow-sm transition-all">
             <Icon icon="solar:users-group-rounded-linear" width={20} />
          </div>
          <div className="flex flex-col overflow-hidden">
             <span className="text-sm font-bold text-foreground truncate">Xuna AI</span>
             <span className="text-xs text-default-500 truncate">Core workspace</span>
          </div>
          <div className="ml-auto">
             <Icon icon="solar:alt-arrow-down-linear" width={14} className="text-default-400" />
          </div>
        </div>

        {/* Sidebar Navigation - Simple like Figma */}
        <ScrollShadow className="-mr-4 pr-4 flex-1">
          <HeroSidebar
            defaultSelectedKey={currentPath}
            iconClassName="text-default-400 w-5 h-5 group-data-[selected=true]:text-foreground transition-colors"
            itemClasses={{
              base: "px-3 py-3 rounded-xl data-[selected=true]:bg-default-100 data-[hover=true]:bg-default-50 mb-1 transition-all",
              title: "text-sm text-foreground/60 data-[selected=true]:text-foreground font-medium ml-2",
            }}
            items={sidebarItems}
            onSelect={handleSelect}
          />
          
          <Spacer y={6} />
          <div className="px-3 mb-3 mt-2">
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Configuration</p>
          </div>
          
          <HeroSidebar
            defaultSelectedKey={currentPath}
            iconClassName="text-default-400 w-5 h-5 group-data-[selected=true]:text-foreground transition-colors"
            itemClasses={{
                base: "px-3 py-3 rounded-xl data-[selected=true]:bg-default-100 data-[hover=true]:bg-default-50 mb-1 transition-all",
                title: "text-sm text-foreground/60 data-[selected=true]:text-foreground font-medium ml-2",
            }}
            items={configItems}
            onSelect={handleSelect}
          />
        </ScrollShadow>

        {/* Pinned Bottom Section */}
        <div className="mt-auto pt-6 pb-2">
          {/* Schedule a Call Section */}
          <div className="mb-6">
            <div className="rounded-[20px] p-5 border border-default-200 bg-white dark:bg-default-50/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <p className="text-sm text-foreground font-bold mb-4 text-center">Schedule a Call</p>
              <div className="flex items-center border border-default-200 rounded-xl overflow-hidden mb-4 bg-white dark:bg-black/20 h-11 transition-colors hover:border-default-300">
                <div className="flex items-center gap-2 px-3 border-r border-default-200 h-full bg-default-50/50">
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-sm font-medium text-foreground">+1</span>
                </div>
                <Input
                  aria-label="Phone number"
                  className="flex-1"
                  classNames={{
                    inputWrapper: "h-full bg-transparent border-none shadow-none",
                    input: "text-sm px-3",
                  }}
                  placeholder=""
                  size="sm"
                  type="tel"
                  value={phoneNumber}
                  onValueChange={setPhoneNumber}
                />
              </div>
              <Button
                className="w-full h-11 rounded-xl font-semibold shadow-lg shadow-primary/20 text-white text-sm"
                color="primary"
                size="md"
                onPress={handleCall}
              >
                Call Me
              </Button>
            </div>
          </div>

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
                <div className="flex flex-col text-left">
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
            <DropdownSection aria-label="Account Actions">
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
        </div>
      </div>
    </div>
  );
}
