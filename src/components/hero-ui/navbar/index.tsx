"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Avatar,
  Badge,
} from "@heroui/react";
import {Icon} from "@iconify/react";

import NotificationsCard from "./notifications-card";

import logoImage from "@/assets/logo.png";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setTheme } from "@/store/settingsSlice";
import { applyTheme } from "@/app/theme";

export default function XunaNavbar() {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((s) => s.settings.theme);
    const resolvedTheme = React.useMemo<"light" | "dark">(() => {
        if (mode !== "system") return mode;
        if (typeof window === "undefined") return "light";
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }, [mode]);

    const toggleTheme = () => {
        const next = resolvedTheme === "dark" ? "light" : "dark";
        dispatch(setTheme(next));
        applyTheme(next);
        localStorage.setItem("theme", next);
    };
    
  return (
    <Navbar
      classNames={{
        item: "data-[active=true]:text-primary",
        wrapper: "w-full max-w-full px-4 sm:px-6 flex items-center justify-between",
      }}
      className={`w-full mx-0 border-b dark:border-opacity-10 z-40 border-white dark:bg-[#0B0B0B]/80`}
				style={{
					backdropFilter: 'blur(16px) saturate(180%)',
					WebkitBackdropFilter: 'blur(16px) saturate(180%)',
					borderBottom: resolvedTheme === "dark" ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(228,228,231,1)'
				}}
      height="60px"
    >
      <NavbarBrand className="gap-0 pl-0">
        <NavbarMenuToggle className="mr-2 h-6 sm:hidden" />
        <img 
          src={logoImage} 
          alt="XUNA" 
          className="h-auto w-20 object-contain brightness-0 dark:brightness-0 dark:invert"
        />
      </NavbarBrand>
      <NavbarContent
        className="bg-transparent hidden h-12 flex-1 items-center !justify-end rounded-full sm:flex"
      >
        <NavbarItem>
            <Link className="flex gap-2 text-inherit" href="/agents">
            Dashboard
            </Link>
        </NavbarItem>
        <NavbarItem isActive>
            <Link aria-current="page" className="flex gap-2 text-inherit" href="#">
            Deployments
            </Link>
        </NavbarItem>
        <NavbarItem>
            <Link className="flex gap-2 text-inherit" href="#">
            Analytics
            </Link>
        </NavbarItem>
        <NavbarItem>
            <Link className="flex gap-2 text-inherit" href="#">
            Team
            </Link>
        </NavbarItem>
        <NavbarItem>
            <Link className="flex gap-2 text-inherit" href="/settings">
            Settings
            </Link>
        </NavbarItem>
        <NavbarContent className="max-w-fit items-center ml-10 gap-0 p-0">
            <NavbarItem className="hidden sm:flex">
                <Button isIconOnly radius="full" variant="light">
                <Icon className="text-default-500" icon="solar:magnifer-linear" width={22} />
                </Button>
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
                <Button isIconOnly radius="full" variant="light" onPress={toggleTheme}>
                    <Icon className="text-default-500" icon={resolvedTheme === "dark" ? "solar:sun-linear" : "solar:moon-linear"} width={24} />
                </Button>
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
                <Button isIconOnly radius="full" variant="light">
                <Icon className="text-default-500" icon="solar:settings-linear" width={24} />
                </Button>
            </NavbarItem>
            <NavbarItem className="flex">
                <Popover offset={12} placement="bottom-end">
                <PopoverTrigger>
                    <Button
                    disableRipple
                    isIconOnly
                    className="overflow-visible"
                    radius="full"
                    variant="light"
                    >
                    <Badge color="danger" content="5" showOutline={false} size="md">
                        <Icon className="text-default-500" icon="solar:bell-linear" width={22} />
                    </Badge>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
                    <NotificationsCard className="w-full shadow-none" />
                </PopoverContent>
                </Popover>
            </NavbarItem>
            <NavbarItem className="px-2">
                <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <button className="mt-1 h-8 w-8 outline-hidden transition-transform">
                    <Badge
                        className="border-transparent"
                        color="success"
                        content=""
                        placement="bottom-right"
                        shape="circle"
                        size="sm"
                    >
                        <Avatar size="sm" src="https://i.pravatar.cc/150?u=a04258114e29526708c" />
                    </Badge>
                    </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">johndoe@example.com</p>
                    </DropdownItem>
                    <DropdownItem key="settings">My Settings</DropdownItem>
                    <DropdownItem key="team_settings">Team Settings</DropdownItem>
                    <DropdownItem key="analytics">Analytics</DropdownItem>
                    <DropdownItem key="system">System</DropdownItem>
                    <DropdownItem key="configurations">Configurations</DropdownItem>
                    <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                    <DropdownItem key="logout" color="danger">
                    Log Out
                    </DropdownItem>
                </DropdownMenu>
                </Dropdown>
            </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <NavbarMenuItem>
          <Link className="w-full" color="foreground" href="#">
            Dashboard
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive>
          <Link aria-current="page" className="w-full" color="primary" href="#">
            Deployments
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="w-full" color="foreground" href="#">
            Analytics
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="w-full" color="foreground" href="#">
            Team
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="w-full" color="foreground" href="#">
            Settings
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
