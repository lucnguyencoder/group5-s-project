import { Heart, Store, Tickets, UserRound, Utensils } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";

function NavItem() {
  const location = useLocation();
  const navItems = [
    {
      title: "Foods",
      url: "/food",
      icon: Utensils,
    },
    {
      title: "Stores",
      url: "/store",
      icon: Store,
    },
    {
      title: "Favourites",
      url: "/saved",
      icon: Heart,
    },
    {
      title: "Following",
      url: "/following",
      icon: Store,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {navItems.map((item) => (
        <Link key={item.title} to={item.url}>
          <Button
            key={item.title}
            href={item.url}
            size={"sm"}
            variant={
              location.pathname.includes(item.url) ? "secondary" : "ghost"
            }
            className={`flex items-center text-md font-medium rounded-full gap-2`}
          >
            <item.icon className="h-4 w-4 ml-1" />
            <p className="mr-1">{item.title}</p>
          </Button>
        </Link>
      ))}
    </div>
  );
}

export default NavItem;
