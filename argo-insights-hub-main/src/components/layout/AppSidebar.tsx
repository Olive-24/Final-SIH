import { useState } from "react";
import { 
  Home, 
  MessageCircle, 
  Map, 
  BarChart3, 
  Info, 
  Waves,
  Thermometer,
  Activity,
  AlertTriangle
} from "lucide-react";
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

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Chat", url: "/chat", icon: MessageCircle },
  { title: "Map View", url: "/map", icon: Map },
  { title: "Disaster Prediction", url: "/disaster", icon: AlertTriangle },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "About", url: "/about", icon: Info },
];

const dataItems = [
  { title: "Temperature", url: "/data/temperature", icon: Thermometer },
  { title: "Ocean Currents", url: "/data/currents", icon: Waves },
  { title: "Profiles", url: "/data/profiles", icon: Activity },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-ocean flex items-center justify-center">
              <Waves className="w-5 h-5 text-primary-foreground" />
            </div>
            {state !== "collapsed" && (
              <div>
                <h2 className="font-bold text-sidebar-foreground">ARGO</h2>
                <p className="text-xs text-sidebar-foreground/70">Ocean Data</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Data Exploration */}
        <SidebarGroup>
          <SidebarGroupLabel>Data Explorer</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
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