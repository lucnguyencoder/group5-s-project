import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, ChevronDown, Plus, Check } from "lucide-react";
import { useUser } from "@/context/UserContext";
import LocationForm from "@/components/modules/location/LocationForm";

export function NavDeliveryAddress({ compact = false }) {
  const { deliveryAddresses, setDefaultLocation } = useUser();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [addressToEdit, setAddressToEdit] = useState(null);

  useEffect(() => {
    if (deliveryAddresses && deliveryAddresses.length > 0) {
      const defaultAddress =
        deliveryAddresses.find((addr) => addr.is_default) ||
        deliveryAddresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [deliveryAddresses]);

  const handleSelectAddress = async (address) => {
    setSelectedAddress(address);
    if (!address.is_default) {
      try {
        await setDefaultLocation(address.address_id);
      } catch (error) {
        console.error("Failed to set default address:", error);
      }
    }
  };

  const handleAddAddress = () => {
    setAddressToEdit(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const truncateAddress = (address, maxLength = 20) => {
    if (!address) return "";
    return address.length > maxLength
      ? address.substring(0, maxLength) + "..."
      : address;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {!compact ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-full w-81"
            >
              <MapPin className="h-4 w-4 mx-2 text-primary" />
              <div className="flex-1 flex flex-col items-start">
                <p className="text-xs font-semibold">Deliver to</p>
                {selectedAddress ? (
                  <>
                    <span className="text-xs text-muted-foreground hidden sm:inline ">
                      {truncateAddress(selectedAddress.address_line, 42)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Add delivery address
                  </span>
                )}
              </div>
              <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex items-center justify-center"
            >
              <MapPin className="h-4 w-4 text-primary" />
              {selectedAddress ? (
                <>
                  <span className="text-xs text-muted-foreground hidden sm:inline ">
                    {truncateAddress(selectedAddress.address_line, 60)}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Add delivery address
                </span>
              )}
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className={""}>
          {deliveryAddresses && deliveryAddresses.length > 0 ? (
            <>
              {deliveryAddresses.map((address) => (
                <DropdownMenuItem
                  key={address.address_id}
                  className="flex flex-col items-start py-2 cursor-pointer"
                  onClick={() => handleSelectAddress(address)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="">
                      <p className="font-medium">{address.recipient_name}</p>
                      <p className="text-xs opacity-75">
                        {address.recipient_phone}
                      </p>
                    </div>
                    {address.is_default && (
                      <Check className="h-6 w-6 text-primary ml-2" />
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground -mt-1">
                    {address.address_line}
                  </span>
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <DropdownMenuItem
              disabled
              className="text-center text-muted-foreground text-sm py-4"
            >
              No saved addresses
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="flex items-center mt-2 cursor-pointer"
            onClick={handleAddAddress}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add new address</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LocationForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editMode={formMode === "edit"}
        locationId={addressToEdit?.address_id}
        initialData={addressToEdit}
        onSave={() => setIsFormOpen(false)}
      />
    </>
  );
}

export default NavDeliveryAddress;
