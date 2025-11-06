import { LayoutDashboard, Wallet, Receipt } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

type View = "dashboard" | "accounts" | "transactions";

interface AppSidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const items = [
    { title: "Dashboard", view: "dashboard" as View, icon: LayoutDashboard },
    { title: "Accounts", view: "accounts" as View, icon: Wallet },
    { title: "Transactions", view: "transactions" as View, icon: Receipt },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-6 pb-4">
          {!collapsed && (
            <>
              <h1 className="text-2xl font-bold text-sidebar-primary-foreground">FinanceApp</h1>
              <p className="text-sm text-sidebar-foreground/60 mt-1">Personal Finance Manager</p>
            </>
          )}
          {collapsed && (
            <div className="text-2xl font-bold text-sidebar-primary-foreground text-center">F</div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    isActive={currentView === item.view}
                    onClick={() => onViewChange(item.view)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t border-sidebar-border">
          {!collapsed && (
            <p className="text-xs text-sidebar-foreground/60">© 2024 FinanceApp</p>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
