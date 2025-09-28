import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { isAuthed, signOut } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthed(isAuthed());
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
                  Ocean ARGO
                </h1>
                <p className="text-sm text-muted-foreground">
                  Oceanographic Data Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {authed ? (
                <Button variant="outline" onClick={() => { signOut(); setAuthed(false); navigate("/login"); }}>Logout</Button>
              ) : (
                <Button variant="ocean" onClick={() => navigate("/login")}>Login</Button>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}