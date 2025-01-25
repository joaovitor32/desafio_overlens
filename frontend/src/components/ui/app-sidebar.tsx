import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"

import { Inbox } from "lucide-react"
import { useState } from "react"

const items = [
  {
    title: "Workspace",
    url: "#",
    icon: Inbox,
    subItems: [
      { title: "Criar workspace", url: "/createWorkspace" },
      { title: "Listar workspaces", url: "/getWorkspaces" },
    ]
  }
]

export function AppSidebar() {
  // State to track which menu is currently open
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems.length > 0 && (
                    <Collapsible open={openMenus[item.title] || false}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton onClick={() => toggleMenu(item.title)}>
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
