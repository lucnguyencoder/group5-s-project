import React from "react";

import { NavCart } from "./NavCart";

import { NavDeliveryAddress } from "./NavDeliveryAddress";
import { useUser } from "@/context/UserContext";
import { NavOrder } from "./NavOrder";
import NavItem from "./NavItem";
import { NavUser } from "./NavUser";

export function NavSecondary() {
  const { isAuthenticated } = useUser();
  // const locations = [{ name: "", address: "", isDefault: true }];
  // const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  return (
    <div className="sticky top-0 z-100 flex items-center gap-2  min-w-screen pt-1.5 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="flex shrink-0 items-center gap-4 border px-2 py-2 backdrop-blur-xl bg-background/80 border-secondary/5 justify-between w-full rounded-lg">
        <div className="flex items-center gap-8">
          <span
            className="text-xl font-semibold text-primary pl-4"
            onClick={() => {
              window.location.href = "/food";
            }}
          >
            Yami!
          </span>
          <div className="flex items-center gap-4">
            <NavItem />
          </div>
        </div>
        <div className="flex items-center gap-1 justify-end">
          {isAuthenticated && <NavDeliveryAddress />}
          <NavOrder />
          <NavCart />
          <NavUser />
        </div>
      </header>
    </div>
  );
}

export default NavSecondary;
