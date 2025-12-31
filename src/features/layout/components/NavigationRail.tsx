"use client";

import React from "react";
import { Button, ScrollShadow, Tooltip, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function NavigationRail() {
  return (
    <div className="h-full bg-background border-r border-default-200 hidden sm:flex flex-col items-center w-[64px] py-4 z-20 gap-1 overflow-hidden">
      
      {/* Top Group */}
      <div className="flex flex-col items-center gap-1">
        {/* Logo / Main Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-default-100 text-default-600 mb-1 shadow-sm group cursor-pointer hover:bg-default-200 transition-colors">
           <Icon icon="solar:microphone-3-bold" width={24} />
        </div>

        <Tooltip content="Contacts" placement="right">
          <Button isIconOnly variant="light" className="text-default-400 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
            <Icon icon="solar:card-id-linear" width={24} />
          </Button>
        </Tooltip>

        <Tooltip content="Notifications" placement="right">
          <Button isIconOnly variant="light" className="text-default-400 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
             <Icon icon="solar:bell-linear" width={24} />
          </Button>
        </Tooltip>

        <Tooltip content="Messages" placement="right">
            <Button isIconOnly variant="light" className="text-default-400 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
                <Icon icon="solar:chat-round-line-linear" width={24} />
            </Button>
        </Tooltip>

        <Tooltip content="Favorites" placement="right">
            <Button isIconOnly variant="light" className="text-default-400 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
                <Icon icon="solar:heart-linear" width={24} />
            </Button>
        </Tooltip>

         <Tooltip content="Feedback" placement="right">
            <Button isIconOnly variant="light" className="text-default-400 w-10 h-10 min-w-0 p-0 hover:bg-default-100 rounded-lg transition-colors">
                <Icon icon="solar:like-linear" width={22} />
            </Button>
        </Tooltip>
      </div>

      <div className="w-10 h-px bg-default-100" />

      {/* Middle Group */}
      <div className="flex flex-col items-center gap-2">
         <Tooltip content="Billing" placement="right">
            <Button isIconOnly variant="light" className="text-default-400 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
                <Icon icon="solar:dollar-minimalistic-linear" width={24} />
            </Button>
        </Tooltip>

        <Tooltip content="Analytics" placement="right">
            <Button isIconOnly variant="light" className="text-default-400 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
                <Icon icon="solar:chart-square-linear" width={24} />
            </Button>
        </Tooltip>

        <Tooltip content="Settings" placement="right">
            <Button isIconOnly variant="light" className="text-default-400 w-10 h-10 min-w-0 p-0 hover:bg-default-100 rounded-lg transition-colors">
                <Icon icon="solar:settings-linear" width={22} />
            </Button>
        </Tooltip>
      </div>
      
      <div className="w-10 h-px bg-default-100" />
      
      {/* Bottom Group (Workspaces/Actions) */}
      <div className="mt-auto flex flex-col items-center gap-1 pb-2">
         {/* Workspaces */}
        <div className="flex flex-col gap-2 mb-1">
            <button className="w-11 h-11 rounded-full bg-white dark:bg-default-50/10 border border-default-200 dark:border-default-100/20 text-default-600 dark:text-default-400 font-bold text-xs hover:border-primary hover:text-primary transition-all flex items-center justify-center shadow-sm">
              HU
            </button>
            <button className="w-11 h-11 rounded-full bg-white dark:bg-default-50/10 border border-default-200 dark:border-default-100/20 text-default-600 dark:text-default-400 font-bold text-xs hover:border-primary hover:text-primary transition-all flex items-center justify-center shadow-sm">
              TV
            </button>
            <button className="w-11 h-11 rounded-full bg-white dark:bg-default-50/10 border border-default-200 dark:border-default-100/20 text-default-600 dark:text-default-400 font-bold text-xs hover:border-primary hover:text-primary transition-all flex items-center justify-center shadow-sm">
              HP
            </button>
        </div>

        <div className="w-10 h-px bg-default-100" />

        <Tooltip content="Info" placement="right">
          <Button isIconOnly variant="light" className="text-default-400 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
            <Icon icon="solar:info-circle-linear" width={24} />
          </Button>
        </Tooltip>
        
        <Tooltip content="Log Out" placement="right">
          <Button isIconOnly variant="light" className="text-default-400 w-10 h-10 min-w-0 p-0 hover:bg-default-100 rounded-lg transition-colors">
             <Icon icon="solar:minus-circle-linear" width={22} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
