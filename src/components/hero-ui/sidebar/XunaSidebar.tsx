"use client";

import React from "react";
import {
  Avatar,
  Button,
  ScrollShadow,
  Spacer,
  Tooltip,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Select,
  SelectItem,
  SelectSection,
  Card,
  CardBody,
  CardFooter,
  User,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Badge,
} from "@heroui/react";
import {Icon} from "@iconify/react";
import {useNavigate, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "@/app/hooks";
import {selectCurrentUserData, fetchUserDetails, logout} from "@/store/authSlice";
import {auth} from "@/lib/firebase";

import Sidebar from "./Sidebar";
import {sectionItems} from "./sidebar-items";
import {AcmeIcon} from "./acme"; // Ensure this exists or use fallback

const workspaces = [
  {
    value: "0",
    label: "Xuna AI",
    items: [
      {
        value: "xuna-ai",
        label: "Core workspace",
      },
      {
        value: "design",
        label: "Design workspace",
      },
      {
        value: "dev",
        label: "Dev. workspace",
      },
      {
        value: "marketing",
        label: "Marketing workspace",
      },
    ],
  },
];

const users = [
  {
    id: 1,
    name: "Kate Moore",
    role: "Customer Support",
    team: "Customer Support",
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/e1b8ec120710c09589a12c0004f85825.jpg",
    email: "kate.moore@example.com",
  },
];

export default function XunaSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const userData = useAppSelector(selectCurrentUserData);

  const [phoneNumber, setPhoneNumber] = React.useState("");

  React.useEffect(() => {
    if (auth.currentUser && !userData) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, userData]);

  const displayName = userData?.name || "Kate Moore";
  const userRole = userData?.role === "super-admin" ? "Admin" : "Customer Support";
  // Fallback avatar or user avatar
  const userAvatar = "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/e1b8ec120710c09589a12c0004f85825.jpg";

  const currentPath = React.useMemo(() => {
    const path = location.pathname.substring(1);
    return path || "agents";
  }, [location.pathname]);

  const handleSelect = React.useCallback((key: string) => {
    const allItems = sectionItems.flatMap(section => section.items || []);
    const item = allItems.find(i => i.key === key);
    if (item?.href) {
      navigate(item.href);
    }
  }, [navigate, navigate]);

  return (
    <div className="h-full min-h-full">
      <div className="border-r-small border-divider relative flex h-full w-full flex-1 flex-col p-6">
        
        <div className="flex flex-col gap-y-2">
          {/* Workspace Selector as per user request */}
          <Select
            disableSelectorIconRotation
            aria-label="Select workspace"
            className="px-1"
            classNames={{
              trigger:
                "min-h-14 bg-transparent border-small border-default-200 dark:border-default-100 data-[hover=true]:border-default-500 dark:data-[hover=true]:border-default-200 data-[hover=true]:bg-transparent",
            }}
            defaultSelectedKeys={["xuna-ai"]}
            items={workspaces}
            listboxProps={{
              bottomContent: (
                <Button
                  className="bg-default-100 text-foreground text-center"
                  size="sm"
                  onPress={() => console.log("on create workspace")}
                >
                  New Workspace
                </Button>
              ),
            }}
            placeholder="Select workspace"
            renderValue={(items) => {
              return items.map((item) => (
                <div key={item.key} className="ml-1 flex flex-col items-start justify-center">
                  <span className="text-small font-bold text-foreground leading-tight">Xuna AI</span>
                  <span className="text-[11px] text-default-400 font-medium">Core workspace</span>
                </div>
              ));
            }}
            selectorIcon={
              <Icon color="hsl(var(--heroui-default-500))" icon="lucide:chevrons-up-down" width={14} />
            }
            startContent={
              <div className="border border-default-200 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-default-50/50 shadow-sm">
                <Icon
                  className="text-default-500/80"
                  icon="solar:users-group-rounded-linear"
                  width={22}
                />
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
                {(item) => (
                  <SelectItem key={item.value} aria-label={item.label} textValue={item.label}>
                    <div className="flex flex-row items-center justify-between gap-1">
                      <span>{item.label}</span>
                      <div className="border-small border-default-300 flex h-6 w-6 items-center justify-center rounded-full">
                        <Icon
                          className="text-default-500"
                          icon="solar:users-group-rounded-linear"
                          width={16}
                        />
                      </div>
                    </div>
                  </SelectItem>
                )}
              </SelectSection>
            )}
          </Select>
        </div>

        {/* Scrollable Sidebar Items */}
        <ScrollShadow className="flex-1 -mx-2 px-2 scrollbar-hide py-2">
          <Sidebar
            defaultSelectedKey={currentPath}
            onSelect={handleSelect}
            iconClassName="group-data-[selected=true]:text-foreground"
            itemClasses={{
              base: "data-[selected=true]:bg-default-100 data-[hover=true]:bg-default-300/10 dark:data-[hover=true]:bg-default-200/20",
              title: "group-data-[selected=true]:text-foreground group-data-[selected=true]:font-bold",
            }}
            items={sectionItems}
          />
        </ScrollShadow>

        <div className="mt-auto flex flex-col gap-12 pt-4">
          {/* Schedule Call Card */}
          <div className="bg-default-50/50 border border-divider rounded-[16px] p-2 flex flex-col gap-2 shadow-sm">
            <p className="text-xs font-bold text-foreground text-center">Schedule a Call</p>
            <div className="flex items-center border border-default-200 rounded-xl overflow-hidden h-9 bg-white dark:bg-default-100">
               <div className="flex items-center gap-1.5 px-2 border-r border-default-200 h-full bg-default-50/50">
                  <span className="text-sm">🇺🇸</span>
                  <span className="text-xs font-bold text-default-500">+1</span>
               </div>
               <Input
                  aria-label="Phone number"
                  className="flex-1"
                  classNames={{
                      inputWrapper: "h-full bg-transparent border-none shadow-none min-h-0 py-0",
                      input: "text-xs px-2 h-full",
                  }}
                  placeholder=""
                  size="sm"
                  variant="flat"
                  value={phoneNumber}
                  onValueChange={setPhoneNumber}
               />
            </div>
            <Button 
              className="w-full h-8 bg-[#0070F3] text-white font-bold text-xs rounded-lg shadow-lg shadow-blue-500/10"
              onPress={() => console.log("Call requested")}
            >
              Call Me
            </Button>
          </div>

          {/* User Profile at Bottom */}
          <Dropdown placement="top">
            <DropdownTrigger>
              <Button className="h-16 items-center justify-between" variant="light">
                <User
                  avatarProps={{
                    size: "sm",
                    isBordered: false,
                    src: userAvatar,
                  }}
                  className="justify-start transition-transform"
                  description={userRole}
                  name={displayName}
                />
                <Icon className="text-default-400" icon="lucide:chevrons-up-down" width={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Account switcher"
              variant="flat"
              onAction={(key) => {
                if (key === "logout") {
                  dispatch(logout());
                } else {
                  console.log(`selected user ${key}`);
                }
              }}
            >
              <DropdownSection showDivider>
                  <DropdownItem key="user-info" textValue={displayName}>
                    <div className="flex items-center gap-x-3">
                      <Avatar
                        alt={displayName}
                        size="sm"
                        src={userAvatar}
                      />
                      <div className="flex flex-col">
                        <p className="text-small text-default-600 font-medium">{displayName}</p>
                        <p className="text-tiny text-default-400">{userData?.email || auth.currentUser?.email}</p>
                      </div>
                    </div>
                  </DropdownItem>
              </DropdownSection>
              <DropdownItem key="logout" textValue="Log Out" className="text-danger" color="danger">
                  Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
