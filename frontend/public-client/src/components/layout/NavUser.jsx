import React from "react";
import { LogOut, User, ChevronsUpDown, Handshake, Tickets } from "lucide-react";
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
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";
import { NavThemeMode } from "./NavThemeMode";
import { getInitials } from "@/utils/formatter";
import { Button } from "../ui/button";

export function NavUser() {
  const { user, isAuthenticated, logout } = useUser();
  // const { isMobile } = useSidebar();

  const handleLogout = () => {
    logout();
  };

  return (
    // <SidebarMenu>
    //   <SidebarMenuItem>

    //   </SidebarMenuItem>
    // </SidebarMenu>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="rounded-full px-0 scale-110 outline-none ml-2"
          tooltip={user ? user?.profile?.full_name || "User" : "Guest"}
        >
          {isAuthenticated && user ? (
            <>
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={user?.profile_picture || ""}
                  alt={user?.profile?.full_name || "User"}
                />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user?.profile?.full_name) || ""}
                </AvatarFallback>
              </Avatar>
              {/* <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">
                  {user?.profile?.full_name || user?.email || "You"}
                </span>
                <span className="truncate text-xs">{user.email || ""}</span>
              </div> */}
            </>
          ) : (
            <>
              <div className="bg-muted flex aspect-square size-8 items-center justify-center rounded-lg">
                <User className="size-4" />
              </div>
              {/* <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">Guest</span>
                <span className="truncate text-xs">Please sign in</span>
              </div> */}
            </>
          )}
          {/* <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" /> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        {isAuthenticated && user ? (
          <>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.profile_picture || ""}
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
                  <span className="truncate text-xs">{user.email || ""}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className={"cursor-pointer"}>
                <Link to="/account">
                  <User className="mr-2 h-4 w-4" />
                  Manage my account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className={"cursor-pointer"}>
                <Link to="/tickets">
                  <Tickets className="mr-2 h-4 w-4" />
                  Tickets
                </Link>
              </DropdownMenuItem>
              <NavThemeMode />
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              onClick={handleLogout}
              className={"cursor-pointer"}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>
              To start using our services, please sign in or create an account.
            </DropdownMenuLabel>
            <DropdownMenuSeparator />{" "}
            <DropdownMenuItem asChild>
              <Link to="/auth/login">Sign in</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/auth/register">Create an account</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <NavThemeMode />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
