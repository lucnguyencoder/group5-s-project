import Button12 from "@/components/common/Button12";
import VerticalAccountCard from "@/components/common/VerticalAccountCard";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Plus, MapPin, Trash, Star, MoreVertical, Pencil } from "lucide-react";
import React, { useState } from "react";
import LocationForm from "@/components/modules/location/LocationForm";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function DeliveryInfoForm() {
  const { deliveryAddresses, deleteLocation, setDefaultLocation } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleDeleteLocation = async (addressId) => {
    try {
      await deleteLocation(addressId);
      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error("Failed to delete address", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedAddressId(null);
    }
  };

  const handleSetAsDefault = async (addressId) => {
    try {
      await setDefaultLocation(addressId);
      toast.success("Default address updated");
    } catch (error) {
      toast.error("Failed to update default address", error);
    }
  };

  const confirmDelete = (addressId) => {
    setSelectedAddressId(addressId);
    setIsDeleteDialogOpen(true);
  };

  const handleEditAddress = (address) => {
    setAddressToEdit(address);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleAddAddress = () => {
    setAddressToEdit(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  return (
    <>
      <VerticalAccountCard
        title={
          <div className="flex items-center space-x-2 justify-between w-full">
            <h2 className="">Delivery Information</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleAddAddress}
              className={"-m-4 rounded-full hover:bg-muted/100"}
            >
              <Plus className="h-4 w-4 text-xs" />
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-0 -mx-3 -mt-4">
          {deliveryAddresses && deliveryAddresses.length > 0 ? (
            deliveryAddresses.map((address) => (
              <div
                key={address.address_id}
                className="border-b hover:bg-muted/50 relative px-4 py-3"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{address.recipient_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.recipient_phone}
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    {address.is_default && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full h-fit">
                        Current
                      </span>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!address.is_default && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleSetAsDefault(address.address_id)
                            }
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Set as current address
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleEditAddress(address)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => confirmDelete(address.address_id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-sm mt-1 pr-8">{address.address_line}</p>
                {address.latitude && address.longitude && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>
                      {parseFloat(address.latitude).toFixed(4)},{" "}
                      {parseFloat(address.longitude).toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm p-4">
              You don't have any saved addresses yet. Please add a new one!
            </p>
          )}
        </div>
      </VerticalAccountCard>

      <LocationForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editMode={formMode === "edit"}
        locationId={addressToEdit?.address_id}
        initialData={addressToEdit}
        onSave={() => setIsFormOpen(false)}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAddressId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteLocation(selectedAddressId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DeliveryInfoForm;
