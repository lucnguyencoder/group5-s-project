import { useUser } from "@/context/UserContext";
import React from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Truck } from "lucide-react";

function NavPickUpToggle() {
  const { isPickUp, setIsPickup } = useUser();

  return (
    <Tabs defaultValue={isPickUp ? "pickup" : "delivery"}>
      <TabsList>
        <TabsTrigger value="pickup" onClick={() => setIsPickup(true)}>
          <Store />
          Pick Up
        </TabsTrigger>
        <TabsTrigger value="delivery" onClick={() => setIsPickup(false)}>
          <Truck />
          Delivery
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default NavPickUpToggle;
