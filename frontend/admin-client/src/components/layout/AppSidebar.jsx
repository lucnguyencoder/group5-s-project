//done
import React from "react";
import {
  Users,
  Store,
  User,
  Plus,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain, NavCollapsible } from "./NavMain";
import { NavUser } from "./NavUser";

const data = {
  userMenu: [
    {
      title: "Accounts",
      url: "/accounts",
      icon: User,
      permission: "/api/admin/users",
    },
    {
      title: "Groups",
      url: "/groups",
      icon: Users,
      permission: "/api/admin/groups",
    },
  ],

  storeMenu: [
    {
      title: "New Store",
      url: "/stores/new",
      icon: Plus,
      permission: "/api/admin/stores",
    },
    {
      title: "All Stores",
      url: "/stores/view",
      icon: Store,
      permission: "/api/admin/stores",
    },
  ],

  ticketsMenu: [
    {
      title: "From Customer",
      url: "/tickets/user",
      icon: User,
      permission: "/api/admin/tickets/all",
    },
    {
      title: "From Stores",
      url: "/tickets/store",
      icon: Store,
      permission: "/api/admin/tickets/all",
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { permissions } = useUser();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="flex flex-col h-full"
      {...props}
    >
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <SidebarTrigger className="-ml-1.5"></SidebarTrigger>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary text-nowrap">
              Yami System Console
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-none">
          <NavMain
            items={data.userMenu}
            title="Users"
            permissions={permissions}
          />
          <NavMain
            items={data.storeMenu}
            title="Stores"
            permissions={permissions}
          />
          <NavMain
            items={data.ticketsMenu}
            title="Tickets"
            permissions={permissions}
          />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex-1 px-2 pb-2">
          <NavUser />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
