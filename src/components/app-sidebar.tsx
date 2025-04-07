import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function CafeSidebar() {
  return (
    <Sidebar className="w-40 w-max-160">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-y-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href={'/'}>
                  <span className="text-lg tracking-tight">원두 기부하기</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href={'/donation'}>
                  <span className="text-lg tracking-tight">원두 기부 내역</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>

  )
}
