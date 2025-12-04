import { LayoutDashboard, Wallet, Receipt, Tags } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
type View = "dashboard" | "accounts" | "transactions" | "categories";
interface AppSidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}
export function AppSidebar({
  currentView,
  onViewChange
}: AppSidebarProps) {
  const {
    state
  } = useSidebar();
  const collapsed = state === "collapsed";
  const items = [{
    title: "Dashboard",
    view: "dashboard" as View,
    icon: LayoutDashboard
  }, {
    title: "Accounts",
    view: "accounts" as View,
    icon: Wallet
  }, {
    title: "Transactions",
    view: "transactions" as View,
    icon: Receipt
  }, {
    title: "Categories",
    view: "categories" as View,
    icon: Tags
  }];
  return <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-6 pb-4">
          {!collapsed && <>
              <h1 className="text-2xl font-bold text-sidebar-primary-foreground">MyWallet App</h1>
              <p className="text-sm text-sidebar-foreground/60 mt-1">Personal Finance Manager</p>
            </>}
          {collapsed && <div className="text-2xl font-bold text-sidebar-primary-foreground text-center">F</div>}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton isActive={currentView === item.view} onClick={() => onViewChange(item.view)} tooltip={item.title}>
                    <item.icon className="w-[20px] h-[20px]" />
                    <span className="text-base">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t border-sidebar-border">
          {!collapsed && <p className="text-xs text-sidebar-foreground/60">© 2025 MyWallet App </p>}
        </div>
      </SidebarFooter>
    </Sidebar>;
}