"use client";

import React from "react";
import {Button, Tooltip, Avatar} from "@heroui/react";
import {Icon} from "@iconify/react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "@/app/hooks";
import {logout} from "@/store/authSlice";

export default function CompactSidebar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div className="h-full bg-background border-r border-divider flex flex-col items-center w-[64px] py-6 z-20 gap-4 overflow-hidden">
      
      {/* Top Group */}
      <div className="flex flex-col items-center gap-2">
        <Tooltip content="Agents" placement="right">
          <Button isIconOnly variant="light" className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
            <Icon icon="solar:microphone-3-bold" width={24} />
          </Button>
        </Tooltip>

        <Tooltip content="Contacts" placement="right">
          <Button isIconOnly variant="light" className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
            <Icon icon="solar:card-id-linear" width={24} />
          </Button>
        </Tooltip>

        <Tooltip content="Notifications" placement="right">
          <Button isIconOnly variant="light" className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
             <Icon icon="solar:bell-linear" width={24} />
          </Button>
        </Tooltip>

        <Tooltip content="Messages" placement="right">
            <Button isIconOnly variant="light" className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
                <Icon icon="solar:chat-round-line-linear" width={24} />
            </Button>
        </Tooltip>

        <Tooltip content="Favorites" placement="right">
            <Button isIconOnly variant="light" className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
                <Icon icon="solar:heart-linear" width={24} />
            </Button>
        </Tooltip>

         <Tooltip content="Feedback" placement="right">
            <Button isIconOnly variant="light" className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
                <Icon icon="solar:like-linear" width={22} />
            </Button>
        </Tooltip>
      </div>

      <div className="w-8 h-px bg-default-100 mx-auto" />

      {/* Middle Group */}
      <div className="flex flex-col items-center gap-2">
         <Tooltip content="Billing" placement="right">
            <Button isIconOnly variant="light" className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
                <Icon icon="solar:dollar-minimalistic-linear" width={24} />
            </Button>
        </Tooltip>

        <Tooltip content="Analytics" placement="right">
            <Button isIconOnly variant="light" className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
                <Icon icon="solar:chart-square-linear" width={24} />
            </Button>
        </Tooltip>

        <Tooltip content="Settings" placement="right">
            <Button isIconOnly variant="light" className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
                <Icon icon="solar:settings-linear" width={22} />
            </Button>
        </Tooltip>
      </div>
      
      <div className="w-8 h-px bg-default-100 mx-auto" />
      
      {/* Workspace Circles */}
      <div className="flex flex-col items-center gap-3">
          <Tooltip content="HeroUI" placement="right">
            <button className="w-10 h-10 rounded-full bg-default-100 dark:bg-default-200 border border-divider text-foreground font-bold text-[10px] hover:border-primary hover:text-primary transition-all flex items-center justify-center shadow-sm">
              HU
            </button>
          </Tooltip>
          <Tooltip content="Tailwind Variants" placement="right">
            <button className="w-10 h-10 rounded-full bg-default-100 dark:bg-default-200 border border-divider text-foreground font-bold text-[10px] hover:border-primary hover:text-primary transition-all flex items-center justify-center shadow-sm">
              TV
            </button>
          </Tooltip>
          <Tooltip content="HeroUI Pro" placement="right">
            <button className="w-10 h-10 rounded-full bg-default-100 dark:bg-default-200 border border-divider text-foreground font-bold text-[10px] hover:border-primary hover:text-primary transition-all flex items-center justify-center shadow-sm">
              HP
            </button>
          </Tooltip>
      </div>

      {/* Bottom Group */}
      <div className="mt-auto flex flex-col items-center gap-2 pb-4">
        <Tooltip content="Help & Feedback" placement="right">
          <Button isIconOnly variant="light" className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors">
            <Icon icon="solar:info-circle-linear" width={24} />
          </Button>
        </Tooltip>
        
        <Tooltip content="Log Out" placement="right">
          <Button 
            isIconOnly 
            variant="light" 
            className="text-default-500 w-11 h-11 min-w-0 p-0 hover:bg-default-100 rounded-xl transition-colors"
            onPress={() => dispatch(logout())}
          >
             <Icon icon="solar:minus-circle-linear" width={24} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
