"use client";

import React from "react";
import {Button, ScrollShadow, Tooltip} from "@heroui/react";
import {Icon} from "@iconify/react";

import {compactSidebarItems, sectionItemsWithTeams} from "./sidebar-items";
import Sidebar from "./Sidebar";
import { useAppSelector } from "@/app/hooks";

/**
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} />
 * ```
 */
export default function Component() {
  const mode = useAppSelector((s) => s.settings.theme);
  const resolvedTheme = React.useMemo<"light" | "dark">(() => {
    if (mode !== "system") return mode;
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, [mode]);

  return (
    <div
    className={`h-full min-h-192 mx-0 border-b border-opacity-10 z-40 text-white border-white dark:bg-[#0B0B0B]/80`}
				style={{
					backdropFilter: 'blur(16px) saturate(180%)',
					WebkitBackdropFilter: 'blur(16px) saturate(180%)',
				}}>
      <div className="border-r-small border-divider relative flex h-full w-16 flex-1 flex-col items-center px-2" 
      style={{borderRight: resolvedTheme === "dark" ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(228,228,231,1)'}}>

        <ScrollShadow className="-mr-2 h-full max-h-full py-6 pr-2">

          <Sidebar isCompact defaultSelectedKey="home" items={sectionItemsWithTeams} />

          <div className="mt-auto flex flex-col items-center absolute bottom-8 left-0 w-full gap-3">
            <Tooltip content="Help & Feedback" placement="right">
              <Button isIconOnly className="data-[hover=true]:text-foreground" variant="light">
                <Icon
                  className="text-default-500"
                  icon="solar:info-circle-line-duotone"
                  width={24}
                />
              </Button>
            </Tooltip>
            <Tooltip content="Log Out" placement="right">
              <Button isIconOnly className="data-[hover=true]:text-foreground" variant="light">
                <Icon
                  className="text-default-500 rotate-180"
                  icon="solar:minus-circle-line-duotone"
                  width={24}
                />
              </Button>
            </Tooltip>
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
}
