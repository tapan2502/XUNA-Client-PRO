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
import {
  selectCurrentUserData,
  fetchUserDetails,
  logout,
  selectCurrentUser,
  selectIsImpersonating,
  selectWorkspaces,
  selectEffectiveUserData,
  selectEffectiveUser,
  impersonateUser,
  stopImpersonation,
  type UserData,
} from "@/store/authSlice";
import {auth} from "@/lib/firebase";

import Sidebar from "./Sidebar";
import {sectionItems} from "./sidebar-items";
import {AcmeIcon} from "./acme"; // Ensure this exists or use fallback

export default function XunaSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const userData = useAppSelector(selectCurrentUserData);
  const workspacesList = useAppSelector(selectWorkspaces);
  const isImpersonating = useAppSelector(selectIsImpersonating);
  const effectiveUserData = useAppSelector(selectEffectiveUserData) as UserData | null;
  const effectiveUser = useAppSelector(selectEffectiveUser);
  const currentUser = useAppSelector(selectCurrentUser);

  const [phoneNumber, setPhoneNumber] = React.useState("");

  React.useEffect(() => {
    if (currentUser && !userData) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, userData, currentUser]);

  const displayName = effectiveUserData?.name || "User";
  const userRole = effectiveUserData?.role === "ADMIN" ? "Admin" : 
                 effectiveUserData?.role === "AGENCY" ? "Agency" : "User";
  
  const userAvatar = "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/e1b8ec120710c09589a12c0004f85825.jpg";

  const dynamicWorkspaces = React.useMemo(() => {
    const items = [
      {
        value: "core",
        label: "My Workspace",
        description: "Primary account",
        type: "self",
        role: userData?.role
      }
    ];

    if (userData?.role === "AGENCY" || userData?.role === "ADMIN") {
       // Only show AGENCY level workspaces in the TOP selector
       workspacesList.filter(w => w.role === 'AGENCY').forEach(w => {
         items.push({
           value: w.uid,
           label: w.name,
           description: "Agency Workspace",
           type: "managed",
           role: w.role
         });
       });
    }

    return [{
      value: "workspaces",
      label: "Agencies / Workspaces",
      items: items
    }];
  }, [userData, workspacesList]);

  // Determine the active Agency ID for the top selector
  const activeAgencyKey = React.useMemo(() => {
    if (!isImpersonating) return "core";
    
    // If we are impersonating a USER, we should still show the AGENCY they belong to at the top
    if (effectiveUserData?.role === 'USER') {
      return effectiveUserData.agencyId || "core"; 
    }
    
    // If we are impersonating an AGENCY, show that Agency
    return effectiveUser?.uid || "core";
  }, [isImpersonating, effectiveUserData, effectiveUser]);

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
        
        <div className="flex flex-col gap-y-2">
          {/* Workspace Selector as per user request */}
          <Select
            disableSelectorIconRotation
            aria-label="Select workspace"
            className="px-1"
            classNames={{
              trigger:
                `min-h-14 bg-transparent border-small ${isImpersonating ? 'border-primary' : 'border-default-200'} dark:border-default-100 data-[hover=true]:border-default-500 dark:data-[hover=true]:border-default-200 data-[hover=true]:bg-transparent`,
            }}
            selectedKeys={[activeAgencyKey]}
            items={dynamicWorkspaces}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              console.log('[Workspace Selector] Selected key:', selectedKey);
              console.log('[Workspace Selector] Current impersonating:', isImpersonating);
              
              if (selectedKey === "core") {
                console.log('[Workspace Selector] Stopping impersonation');
                dispatch(stopImpersonation());
              } else if (selectedKey) {
                console.log('[Workspace Selector] Starting impersonation for:', selectedKey);
                dispatch(impersonateUser(selectedKey));
              }
            }}
            placeholder="Select workspace"
            renderValue={(items) => {
              return items.map((item: any) => (
                <div key={item.key} className="ml-1 flex flex-col items-start justify-center">
                  <span className="text-small font-bold text-foreground leading-tight">
                    {item.data.label}
                  </span>
                  <span className="text-[11px] text-default-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                    {item.data.description}
                  </span>
                </div>
              ));
            }}
            selectorIcon={
              <Icon color="hsl(var(--heroui-default-500))" icon="lucide:chevrons-up-down" width={14} />
            }
            startContent={
              <div className={`border ${isImpersonating ? 'border-primary bg-primary/10' : 'border-default-200 bg-default-50/50'} flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-sm`}>
                <Icon
                  className={isImpersonating ? 'text-primary' : 'text-default-500/80'}
                  icon={isImpersonating ? "solar:eye-linear" : "solar:users-group-rounded-linear"}
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
                {(item: any) => (
                  <SelectItem key={item.value} aria-label={item.label} textValue={item.label}>
                    <div className="flex flex-row items-center justify-between gap-1 w-full">
                      <div className="flex flex-col">
                        <span className="text-small font-medium">{item.label}</span>
                        <span className="text-tiny text-default-400">{item.description}</span>
                      </div>
                      <div className={`border-small ${item.type === 'managed' ? 'border-primary' : 'border-default-300'} flex h-6 w-6 items-center justify-center rounded-full`}>
                        <Icon
                          className={item.type === 'managed' ? 'text-primary' : 'text-default-500'}
                          icon={item.type === 'managed' ? "solar:user-linear" : "solar:users-group-rounded-linear"}
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
                    isBordered: isImpersonating,
                    color: isImpersonating ? "primary" : "default",
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
               aria-label="User switcher"
               variant="flat"
               selectionMode="single"
               selectedKeys={[effectiveUser?.uid || "core"]}
               onAction={(key) => {
                 if (key === "back-to-agency") {
                    const agencyId = effectiveUserData?.agencyId || (effectiveUserData?.role === 'AGENCY' ? effectiveUser?.uid : null);
                    if (agencyId) {
                      dispatch(impersonateUser(agencyId));
                    } else {
                      dispatch(stopImpersonation());
                    }
                 } else if (key === "core") {
                   dispatch(stopImpersonation());
                 } else {
                   dispatch(impersonateUser(key as string));
                 }
               }}
            >
              <DropdownSection title="Account" showDivider>
                <DropdownItem 
                  key="core" 
                  textValue={userData?.name || "My Account"}
                  startContent={
                    <Avatar
                      size="sm"
                      src={userAvatar}
                    />
                  }
                >
                  <div className="flex flex-col">
                    <p className="text-small font-medium">{userData?.name || "My Account"}</p>
                    <p className="text-tiny text-default-400">{userData?.email}</p>
                  </div>
                </DropdownItem>
              </DropdownSection>
              
              {/* Hierarchical User Switching (Bottom) */}
              {(userData?.role === "AGENCY" || userData?.role === "ADMIN") && (
                <DropdownSection title="Agency Users">
                  {workspacesList
                    .filter(w => {
                      if (w.role !== 'USER') return false;
                      // If we are in an Agency context (Top), show only that agency's users
                      if (effectiveUserData?.role === 'AGENCY') {
                        return w.agencyId === effectiveUser?.uid;
                      }
                      // If we are viewing a USER, show other users of the same agency
                      if (effectiveUserData?.role === 'USER') {
                        return w.agencyId === effectiveUserData.agencyId;
                      }
                      // Otherwise show all users for Admin
                      return userData?.role === 'ADMIN';
                    })
                    .map((w) => (
                      <DropdownItem
                        key={w.uid}
                        textValue={w.name}
                        startContent={
                          <Avatar
                            size="sm"
                            name={w.name.charAt(0)}
                            className="bg-primary/10 text-primary"
                          />
                        }
                      >
                        <div className="flex flex-col">
                          <p className="text-small font-medium">{w.name}</p>
                          <p className="text-tiny text-default-400">{w.email}</p>
                        </div>
                      </DropdownItem>
                    ))
                  }
                  
                  {/* Option to go back to Agency-wide data if currently viewing as a User */}
                  {effectiveUserData?.role === 'USER' && (
                    <DropdownItem
                      key="back-to-agency"
                      className="text-primary font-bold"
                      startContent={<Icon icon="solar:arrow-left-up-linear" width={20} />}
                    >
                       View Agency Workspace
                    </DropdownItem>
                  )}
                </DropdownSection>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
