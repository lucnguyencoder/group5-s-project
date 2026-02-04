import React from "react";
import {
  Home,
  Users,
  Store,
  Settings2,
  User,
  Shield,
  Bell,
  Save,
  Plus,
  FileText,
  LayoutDashboard,
  BarChart2,
  Pizza,
  Tags,
  Gift,
  ShoppingCart,
  Clock,
  History,
  Calendar,
  TicketCheck,
  Mail,
  UserPlus,
  Cog,
  MapPin,
  Phone,
  StoreIcon,
  TableProperties,
  Layers,
  PanelsTopLeft,
  Truck,
  CogIcon,
  MessageCircle,
} from "lucide-react";
// import { useUser } from "../../context/UserContext";
import { useStore } from "../../context/StoreContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { Badge } from "../ui/badge";
import { useUser } from "@/context/UserContext";

const data = {
  dashboardMenu: [
    {
      title: "My Orders",
      url: "/orders",
      icon: ShoppingCart,
      role: ["manager", "sale_agent"],
    },
    {
      title: "Assigned Orders",
      url: "/orders",
      icon: ShoppingCart,
      role: ["courier"],
    },
    {
      title: "My Profile",
      url: "/account",
      icon: User,
      role: ["courier", "sale_agent"],
    },
  ],

  menuItems: [
    {
      title: "Foods",
      url: "/food",
      icon: Pizza,
      permission: "/api/store/foods",
    },
    {
      title: "Categories",
      url: "/menu/categories",
      icon: Tags,
      permission: "/api/store/categories",
    },
    {
      title: "Discount",
      url: "/discount",
      icon: Gift,
      permission: "/api/store/discount",
    },
  ],

  storeManagementMenu: [
    {
      title: "Customization",
      url: "/custom",
      icon: PanelsTopLeft,
      permission: "/api/store/custom/",
    },
    {
      title: "Staffs",
      url: "/staff",
      icon: Users,
      permission: "/api/store/staff",
    },
    {
      title: "Store Profile",
      url: "/store",
      icon: StoreIcon,
      permission: "/api/store/profile",
    },
    {
      title: "Shipping / Fee",
      url: "/configuration",
      icon: CogIcon,
      permission: "/api/store/profile/config",
    },
  ],

  communicationMenu: [
    {
      title: "Tickets",
      url: "/tickets",
      icon: TicketCheck,
      permission: "/api/store/tickets",
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { store, loading } = useStore();
  const { permissions } = useUser();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="flex flex-col h-full"
      {...props}
    >
      <SidebarHeader>
        <div className="flex items-start gap-3 px-2 py-2">
          <SidebarTrigger className="-ml-1.5"></SidebarTrigger>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <span className="text-lg font-semibold text-primary truncate">
              {loading ? "Yami Partner" : store?.name || "Yami Partner"}
            </span>
            {/* {store && !loading && (
              <Badge
                variant={
                  store.isActive
                    ? store.isTempClosed
                      ? "secondary"
                      : "outline"
                    : "outline"
                }
                className={"-mt-1 text-xs"}
                size="sm"
              >
                {store.isActive
                  ? store.isTempClosed
                    ? "Closed"
                    : "Accepting Orders"
                  : "Disabled"}
              </Badge>
            )} */}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-none">
          <NavMain items={data.dashboardMenu} title="Dashboard" />
          <NavMain
            items={data.menuItems}
            title="Menu"
            permissions={permissions}
          />
          <NavMain
            items={data.communicationMenu}
            title="Communication"
            permissions={permissions}
          />
          <NavMain
            items={data.storeManagementMenu}
            title="Store"
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
