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
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectEffectiveUser, logout } from "@/store/authSlice";
import NotificationsCard from "./NotificationsCard";
import NavbarActions from "./navbar/NavbarActions";

// Logo component
const AppIcon = () => (
  <svg
    className="text-primary"
    fill="none"
    height="36"
    viewBox="0 0 32 32"
    width="36"
  >
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default function HeroUINavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectEffectiveUser);
  

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Navbar
      classNames={{
        base: "bg-background border-b border-divider",
        wrapper: "px-6 max-w-full",
        item: "data-[active=true]:text-primary",
      }}
      height="64px"
      maxWidth="full"
    >
      {/* Left: Logo */}
      <NavbarBrand className="gap-2 flex-grow-0">
        <NavbarMenuToggle className="mr-2 h-6 sm:hidden" />
        <AppIcon />
        <p className="font-bold text-inherit">XUNA AI</p>
      </NavbarBrand>

      {/* Right: Navigation Links + Action Icons */}
      <NavbarContent className="gap-6" justify="end">
        {/* Navigation Links */}
        <NavbarItem className="hidden sm:flex" isActive={isActive("/dashboard")}>
          <Link
            className={`text-sm font-medium transition-colors ${
              isActive("/dashboard") 
                ? "text-primary" 
                : "text-default-600 hover:text-foreground"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
          >
            Dashboard
          </Link>
        </NavbarItem>
        {/*
        <NavbarItem className="hidden sm:flex" isActive={isActive("/dashboard/deployments")}>
          <Link
            className={`text-sm font-medium transition-colors ${
              isActive("/dashboard/deployments") 
                ? "text-primary" 
                : "text-default-600 hover:text-foreground"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/deployments");
            }}
          >
            Deployments
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex" isActive={isActive("/dashboard/analytics")}>
          <Link
            className={`text-sm font-medium transition-colors ${
              isActive("/dashboard/analytics") 
                ? "text-primary" 
                : "text-default-600 hover:text-foreground"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/analytics");
            }}
          >
            Analytics
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex" isActive={isActive("/dashboard/team")}>
          <Link
            className={`text-sm font-medium transition-colors ${
              isActive("/dashboard/team") 
                ? "text-primary" 
                : "text-default-600 hover:text-foreground"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/team");
            }}
          >
            Team
          </Link>
        </NavbarItem>
        */}
        <NavbarItem className="hidden sm:flex" isActive={isActive("/dashboard/settings")}>
          <Link
            className={`text-sm font-medium transition-colors ${
              isActive("/dashboard/settings") 
                ? "text-primary" 
                : "text-default-600 hover:text-foreground"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/settings");
            }}
          >
            Settings
          </Link>
        </NavbarItem>

        <NavbarActions />
        
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="ml-2 transition-transform shrink-0"
              size="sm"
              src={`https://ui-avatars.com/api/?name=${user?.email || "User"}&background=random`}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user?.email || "user@example.com"}</p>
            </DropdownItem>
            <DropdownItem
              key="profile_settings"
              onClick={() => navigate("/dashboard/profile")}
            >
              My Profile
            </DropdownItem>
            <DropdownItem
              key="settings"
              onClick={() => navigate("/dashboard/settings")}
            >
              Settings
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <NavbarMenuItem isActive={isActive("/dashboard")}>
          <Link
            className="w-full"
            color={isActive("/dashboard") ? "primary" : "foreground"}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
          >
            Dashboard
          </Link>
        </NavbarMenuItem>
        {/*
        <NavbarMenuItem isActive={isActive("/dashboard/deployments")}>
          <Link
            className="w-full"
            color={isActive("/dashboard/deployments") ? "primary" : "foreground"}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/deployments");
            }}
          >
            Deployments
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={isActive("/dashboard/analytics")}>
          <Link
            className="w-full"
            color={isActive("/dashboard/analytics") ? "primary" : "foreground"}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/analytics");
            }}
          >
            Analytics
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={isActive("/dashboard/team")}>
          <Link
            className="w-full"
            color={isActive("/dashboard/team") ? "primary" : "foreground"}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/team");
            }}
          >
            Team
          </Link>
        </NavbarMenuItem>
        */}
        <NavbarMenuItem isActive={isActive("/dashboard/settings")}>
          <Link
            className="w-full"
            color={isActive("/dashboard/settings") ? "primary" : "foreground"}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/settings");
            }}
          >
            Settings
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
