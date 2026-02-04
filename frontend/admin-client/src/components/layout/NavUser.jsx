import React from "react";
import { LogOut, User, ChevronsUpDown, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavThemeMode } from "./NavThemeMode";
import { formatString, getInitials } from "@/utils/formatter";
import { Badge } from "../ui/badge";

export function NavUser() {
  const { user, isAuthenticated, logout } = useUser();
  const { isMobile } = useSidebar();

  const handleLogout = () => {
    logout();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center cursor-pointer"
              tooltip={user ? user?.profile?.full_name || "User" : "Guest"}
            >
              {isAuthenticated && user ? (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user.avatar || ""}
                      alt={user?.profile?.full_name || "User"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user?.profile?.full_name) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium">
                      {user?.profile?.full_name ||
                        user?.email ||
                        "Authorized User"}
                    </span>
                    <span className="truncate text-xs">
                      {/* {user?.profile?.full_name ? user.email : ""} */}
                      {formatString(user?.group?.name)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-muted flex aspect-square size-8 items-center justify-center rounded-lg">
                    <User className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium">
                      Unauthorized User
                    </span>
                    {/* <span className="truncate text-xs">Please sign in</span> */}
                  </div>
                </>
              )}
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {isAuthenticated && user ? (
              <>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user.avatar || ""}
                        alt={user?.profile?.full_name || "User"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(user?.profile?.full_name) || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user?.profile?.full_name || "User"}
                      </span>
                      <span className="truncate text-xs">
                        {user.email || ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>{" "}
                <DropdownMenuSeparator />{" "}
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className={"cursor-pointer"}>
                    <Link to="/account">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <NavThemeMode />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className={"cursor-pointer"}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/auth/login">Sign in</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <NavThemeMode />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
