import React from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-full w-full flex-col max-h-[100vh]">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
