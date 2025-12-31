"use client";

import React from "react";
import {Avatar, Button, ScrollShadow, Spacer, Tooltip, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import {Icon} from "@iconify/react";
import {useNavigate, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "@/app/hooks";
import {selectCurrentUserData, fetchUserDetails, logout} from "@/store/authSlice";
import {auth} from "@/lib/firebase";

import Sidebar from "./Sidebar";
import {sectionItems} from "./SidebarItems";

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

  const currentPath = React.useMemo(() => {
    return location.pathname;
  }, [location.pathname]);

  const handleSelect = React.useCallback((key: string) => {
    const allItems = sectionItems.flatMap(section => section.items || []);
    const item = allItems.find(i => i.key === key);
    if (item?.href) {
      navigate(item.href);
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-r border-divider w-[240px] overflow-hidden">
      {/* Workspace Header */}
      <div className="p-3 pb-0">
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-divider hover:bg-default-50 cursor-pointer transition-all shadow-sm group">
          <div className="w-10 h-10 rounded-xl bg-default-100 flex items-center justify-center group-hover:bg-white transition-colors overflow-hidden">
            <Avatar className="w-8 h-8 rounded-lg" src={`https://ui-avatars.com/api/?name=Xuna+AI&background=DDE0E2&color=667085`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-foreground truncate">Xuna AI</span>
            <span className="text-[10px] text-default-400 font-bold uppercase tracking-widest">Core workspace</span>
          </div>
          <Icon icon="solar:alt-arrow-down-bold" className="ml-auto text-default-300" width={12} />
        </div>
      </div>

      {/* Main Nav Area - Fallback Scroll */}
      <div className="flex-1 px-3 mt-1 overflow-hidden">
        <Sidebar 
          defaultSelectedKey={currentPath} 
          items={sectionItems} 
          onItemSelect={handleSelect}
          itemClasses={{
            base: "px-3 py-2.5 rounded-xl data-[selected=true]:bg-default-100 mb-0.5 transition-all h-10 group",
            title: "text-sm text-default-500 data-[selected=true]:text-foreground group-data-[selected=true]:font-bold font-medium ml-2"
          }}
          sectionClasses={{
            heading: "px-3 pt-2 pb-1 text-[10px] font-bold text-default-400 uppercase tracking-widest"
          }}
        />
        <div className="px-3">
          <div className="h-px bg-default-100 w-full my-2" />
        </div>
      </div>

      <div className="mt-auto p-3 pt-0 space-y-2">
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

        <div className="flex items-center gap-3 p-1 rounded-xl transition-all group">
          <Avatar
            size="sm"
            className="w-9 h-9 border-2 border-white dark:border-default-100 shadow-sm"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-bold text-foreground truncate leading-none">{userEmail}</span>
            <span className="text-[10px] text-default-400 font-medium mt-1 uppercase tracking-wider">{userRole}</span>
          </div>
          <Button 
            isIconOnly 
            variant="light" 
            size="sm" 
            className="text-default-400 hover:bg-default-100"
            onPress={handleLogout}
          >
            <Icon icon="solar:logout-3-bold-duotone" width={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
