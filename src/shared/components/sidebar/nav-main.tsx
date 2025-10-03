"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import Link from "next/link";
import { navLinks } from "./links";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navLinks.map((link, index) => {
          // If it has subLinks, use Collapsible
          if (link.subLinks && link.subLinks.length > 0) {
            return (
              <Collapsible
                key={`${link.title}-${index}`}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={link.title}
                      className="hover:cursor-pointer"
                    >
                      {link.icon && <link.icon />}
                      <span>{link.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {link.subLinks.map((subLink, subIndex) => (
                        <SidebarMenuSubItem
                          key={`${subLink.title}-${subIndex}`}
                        >
                          <SidebarMenuSubButton asChild>
                            <Link href={subLink.url}>
                              <span>{subLink.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // If it does NOT have subLinks, render a normal link
          return (
            <SidebarMenuItem key={`${link.title}-${index}`}>
              <SidebarMenuButton
                tooltip={link.title}
                className="hover:cursor-pointer"
              >
                {link.icon && <link.icon />}
                <Link href={link.url}>
                  <span>{link.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
