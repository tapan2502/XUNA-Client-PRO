"use client";

import React from "react";
import {Avatar, Button, ScrollShadow, Spacer, Tooltip, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem, SelectSection, Card, CardBody, CardFooter, User} from "@heroui/react";
import {Icon} from "@iconify/react";
import {useNavigate, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "@/app/hooks";
import {selectCurrentUserData, fetchUserDetails, logout} from "@/store/authSlice";
import {auth} from "@/lib/firebase";

import Sidebar from "./Sidebar";
import {sectionItems} from "./sidebar-items";

const workspaces = [
  {
    key: "xuna-ai",
    name: "Xuna AI",
    role: "Core workspace",
    avatar: "https://heroui.com/avatars/avatar-1.png",
  },
  {
    key: "acme-inc",
    name: "Acme Inc.",
    role: "Design workspace",
    avatar: "https://heroui.com/avatars/avatar-2.png",
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
  {
    id: 2,
    name: "John Doe",
    role: "Product Designer",
    team: "Design",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c",
    email: "john.doe@example.com",
  },
  {
    id: 3,
    name: "Jane Doe",
    role: "Product Manager",
    team: "Product",
    avatar: "https://i.pravatar.cc/150?u=a04258114e22026708c",
    email: "jane.doe@example.com",
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
  const userEmail = userData?.email || auth.currentUser?.email || "";
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
  }, [navigate]);

  return (
    <div className="h-full min-h-full">
      <div className="border-r-small border-divider relative flex h-full w-full flex-1 flex-col p-6">
        {/* Top Header removed as per instructions "dont need search notification profile from tiop" */}
        
        <div className="flex flex-col gap-y-2">
          {/* Workspace Selector */}
          <Select
            aria-label="Select workspace"
            className="px-1"
            classNames={{
              trigger: "h-14 bg-default-50/50 border-divider hover:bg-default-100/50 shadow-sm transition-colors",
              value: "text-small font-semibold",
            }}
            defaultSelectedKeys={["xuna-ai"]}
            items={workspaces}
            renderValue={(items) => {
              return items.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  <Avatar
                    isBordered
                    className="w-8 h-8 text-tiny"
                    src={workspaces.find(w => w.key === item.key)?.avatar || "https://heroui.com/avatars/avatar-1.png"}
                  />
                  <div className="flex flex-col">
                    <span className="text-small font-bold">{workspaces.find(w => w.key === item.key)?.name || "Xuna AI"}</span>
                    <span className="text-tiny text-default-400 font-normal">{workspaces.find(w => w.key === item.key)?.role || "Core workspace"}</span>
                  </div>
                </div>
              ));
            }}
            variant="bordered"
          >
            {(workspace) => (
              <SelectItem key={workspace.key} textValue={workspace.name}>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6" src={workspace.avatar} />
                  <div className="flex flex-col">
                    <span className="text-small font-medium">{workspace.name}</span>
                    <span className="text-tiny text-default-400">{workspace.role}</span>
                  </div>
                </div>
              </SelectItem>
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
              onAction={(key) => console.log(`selected user ${key}`)}
            >
              {users.map((user) => (
                <DropdownItem key={user.id} textValue={user.name}>
                  <div className="flex items-center gap-x-3">
                    <Avatar
                      alt={user.name}
                      classNames={{
                        base: "shrink-0",
                        img: "transition-none",
                      }}
                      size="sm"
                      src={user.avatar}
                    />
                    <div className="flex flex-col">
                      <p className="text-small text-default-600 font-medium">{user.name}</p>
                      <p className="text-tiny text-default-400">{user.email}</p>
                    </div>
                  </div>
                </DropdownItem>
              ))}
              <DropdownItem key="logout" textValue="Log Out" onPress={() => dispatch(logout())}>
                 Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
