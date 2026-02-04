import React from "react";
import { ChevronRight, Plus } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export function NavMain({ items, title, permissions = null }) {
  const location = useLocation();
  const { user } = useUser();
  const currentGroup = user?.group?.name || null;
  if (!currentGroup) return null;

  let filterItem = [];

  if (!permissions) {
    filterItem = items.filter((item) => {
      if (item.role && item.role.length > 0) {
        return item.role.includes(currentGroup);
      }
      return true;
    });
  } else {
    filterItem = items.filter((item) => {
      return permissions.some((perm) => {
        return perm.url === item.permission || perm.url === item.permission + "/";
      });
    });
  }

  if (filterItem.length === 0) return null;

  const isActive = (url) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {filterItem.map((item) => {
          const active = isActive(item.url);
          return (
            <SidebarMenuItem key={item.title}>
              {/* <pre>
                <code>
                  {JSON.stringify(item, null, 2)}
                </code>
              </pre> */}
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={active}
                className={`
                  relative transition-all duration-200 ease-in-out
                  ${
                    active
                      ? "text-primary hover:bg-primary/15 border-none"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <Link to={item.url}>
                  <item.icon
                    className={`h-5 w-5 ${active ? "text-primary" : ""}`}
                  />{" "}
                  <span
                    className={`font-medium ${
                      active ? "text-primary font-semibold" : ""
                    }`}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavCollapsible({ items, title, icon: Icon, isActive = false }) {
  const location = useLocation();

  const isItemActive = (url) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={title}>
                {Icon && <Icon />}
                <span>{title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {items.map((item) => {
                  const active = isItemActive(item.url);
                  return (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        className={`
                          relative transition-all duration-200 ease-in-out
                          ${
                            active
                              ? "bg-primary/10 text-primary hover:bg-primary/15"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }
                        `}
                      >
                        <Link to={item.url}>
                          <item.icon
                            className={`${active ? "text-primary" : ""}`}
                          />
                          <span
                            className={`${
                              active ? "text-primary font-semibold" : ""
                            }`}
                          >
                            {item.title}
                          </span>
                          {active && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-full" />
                          )}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavCollapsibleWithAction({
  items,
  title,
  icon: Icon,
  actionIcon: ActionIcon = Plus,
  actionTooltip = "Add",
  onAction,
  isActive = false,
}) {
  const location = useLocation();

  const isItemActive = (url) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <SidebarGroup>
      {title && (
        <div className="flex items-center justify-between py-2">
          <SidebarGroupLabel className="py-0">{title}</SidebarGroupLabel>
          {ActionIcon && onAction && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onAction}
              title={actionTooltip}
            >
              <ActionIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={title}>
                {Icon && <Icon />}
                <span>{title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {items.map((item) => {
                  const active = isItemActive(item.url);
                  return (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        className={`
                          relative transition-all duration-200 ease-in-out
                          ${
                            active
                              ? "bg-primary/10 text-primary hover:bg-primary/15"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }
                        `}
                      >
                        <Link to={item.url}>
                          <item.icon
                            className={`${active ? "text-primary" : ""}`}
                          />
                          <span
                            className={`${
                              active ? "text-primary font-semibold" : ""
                            }`}
                          >
                            {item.title}
                          </span>
                          {active && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-full" />
                          )}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavFooter({ items }) {
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link to={item.url}>
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
