import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4">
            <SidebarTrigger className="lg:hidden" />
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/EstateFlow.png" 
                  alt="EstateFlow Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">EstateFlow</h1>
                <p className="text-sm text-muted-foreground">Insights für Asset Manager</p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
      
      <Toaster />
    </SidebarProvider>
  );
}