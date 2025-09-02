import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Home, 
  FileText, 
  Upload, 
  BarChart3, 
  MessageCircle 
} from "lucide-react";

const navigationItems = [
  { title: "Übersicht", url: "/", icon: Home },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Dokumente", url: "/documents", icon: Upload },
  { title: "Analysen", url: "/analysis", icon: BarChart3 },
  { title: "Q&A", url: "/chat", icon: MessageCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"}>
      <SidebarContent className="bg-sidebar-background">
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className={isCollapsed ? "hidden" : "block"}>
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavClassName}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}