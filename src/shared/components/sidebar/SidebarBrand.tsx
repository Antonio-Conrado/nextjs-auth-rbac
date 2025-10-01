"use client";

import { SidebarMenu, SidebarMenuItem } from "@/shared/components/ui/sidebar";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function SidebarBrand() {
  const t = useTranslations("ui");
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="text-sidebar-primary-foreground flex  gap-4 items-center justify-center rounded-lg">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={50}
            height={50}
            className="w-fit"
          />
          <div className="grid flex-1 text-left text-sm leading-tight text-gray-800 dark:text-white">
            <span className="truncate font-medium">{t("metadata.title")}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
