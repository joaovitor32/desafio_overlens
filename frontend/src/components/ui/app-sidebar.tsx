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
import { useCallback, useState } from "react"

import { Inbox } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/globals/store/user"

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
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const { push } = useRouter()
  const { clearUser } = useUserStore()

  const toggleMenu = useCallback((title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  }, []);

  const handleLogout = useCallback(() => {
    clearUser()
    push("/")
  }, [clearUser, push]);

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
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
