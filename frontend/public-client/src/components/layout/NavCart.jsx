import React, { useContext } from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CartContext } from "@/context/CartContext";
import CartContainer from "../modules/cart/CartContainer";
import NavDeliveryAddress from "./NavDeliveryAddress";
import { ScrollArea } from "../ui/scroll-area";
import { useUser } from "@/context/UserContext";
import NavPickUpToggle from "./NavPickUpToggle";

export function NavCart() {
  const { cart } = useContext(CartContext);
  const { isPickUp } = useUser();
  /**
   * cart: {
   *  "1": [<CartItem />, <CartItem />],
   * "2": [<CartItem />]}
   */

  let totalItems = 0;
  Object.values(cart).forEach((items) => {
    totalItems += items.length;
  });

  return (
    <Dialog className="">
      <DialogTrigger asChild>
        <Button
          className="text-primary-foreground px-3 rounded-l-xs rounded-r-lg"
          tooltip="Your Basket"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-medium">Basket ({totalItems})</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:min-w-1/2 p-0 overflow-hidden outline-none gap-0">
        <DialogHeader className={"px-4 pt-4 bg-card border-b"}>
          <DialogTitle className={"mb-4"}>My Basket</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] p-0">
          <CartContainer cart={cart} />
        </ScrollArea>
        <DialogFooter className={"bg-card p-2 border-t"}>
          <div className="mr-auto flex items-center gap-4 flex-1 overflow-hidden">
            <NavPickUpToggle onCart={true} />
          </div>
          {!isPickUp && <NavDeliveryAddress compact />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
