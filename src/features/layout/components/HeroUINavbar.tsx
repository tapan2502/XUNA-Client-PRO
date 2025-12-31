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
import logoImage from "@/assets/logo.png";



export default function HeroUINavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectEffectiveUser);

  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    import("@/app/theme").then(({ applyTheme }) => {
      applyTheme(next);
      localStorage.setItem("theme", next);
      setTheme(next);
    });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Navbar
      classNames={{
        base: "bg-white dark:bg-background border-b border-divider/50 h-[64px]",
        wrapper: "px-6 pl-2 max-w-full",
      }}
      height="64px"
      maxWidth="full"
    >
      <NavbarBrand className="flex-grow-0 min-w-fit p-0">
        <img 
          src={logoImage} 
          alt="XUNA" 
          className="h-12 w-auto object-contain brightness-0 dark:brightness-0 dark:invert"
        />
      </NavbarBrand>

      {/* Right: Navigation Links & Actions */}
      <NavbarContent className="gap-6" justify="end">
        {/* Navigation Links */}
        <div className="flex items-center gap-6 mr-4">
          <Link
            className={`text-[14px] font-medium transition-colors ${
              isActive("/dashboard") 
                ? "text-foreground font-semibold" 
                : "text-default-500 hover:text-foreground"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
          >
            Agents
          </Link>
          <Link
            className={`text-[14px] font-medium transition-colors ${
              isActive("/dashboard/settings") 
                ? "text-foreground font-semibold" 
                : "text-default-500 hover:text-foreground"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/settings");
            }}
          >
            Settings
          </Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          <Button isIconOnly variant="light" className="text-default-400 min-w-8 w-8 h-8">
            <Icon icon="solar:magnifier-linear" width={20} />
          </Button>
          
          {/* Theme Toggle */}
          <Button 
            isIconOnly 
            variant="light" 
            className="text-default-400 min-w-8 w-8 h-8"
            onPress={toggleTheme}
          >
            <Icon 
              icon={theme === "dark" ? "solar:sun-bold-duotone" : "solar:moon-bold-duotone"} 
              className={theme === "dark" ? "text-warning" : "text-default-500"}
              width={20} 
            />
          </Button>
          
          <Button isIconOnly variant="light" className="text-default-400 min-w-8 w-8 h-8">
            <Icon icon="solar:settings-linear" width={20} />
          </Button>
          
          <Avatar
            className="ml-2 shrink-0 w-9 h-9 border-2 border-white dark:border-default-100 shadow-sm"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </div>
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
            Agents
          </Link>
        </NavbarMenuItem>
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
