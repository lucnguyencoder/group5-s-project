import FormTile from "@/components/common/FormTile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Store,
  FileText,
  MapPin,
  Phone,
  Clock,
  Save,
  DoorOpen,
  LocateIcon,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import TimeField from "../../common/TimeField";
import { storeService } from "@/services/basicService";
import { toast } from "sonner";
import storeLocationService from "@/services/storeLocationService";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { imageService } from "@/services/imageService";
import { validateFullName, validatePhone } from "@/utils/validators";

function StoreInforForm() {
  const { store, setStore } = useStore();
  const [editingField, setEditingField] = useState(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("avatar");
  const fileInputRef = useRef(null);
  const [editValue, setEditValue] = useState({
    name: store?.name,
    description: store?.description,
    address: store?.address,
    phone: store?.phone,
    isTempClosed: store?.isTempClosed,
    opening_time: store?.opening_time,
    closing_time: store?.closing_time,
    latitude: store?.latitude,
    longitude: store?.longitude,
  });

  useEffect(() => {
    setEditValue({
      name: store?.name,
      description: store?.description,
      address: store?.address,
      phone: store?.phone,
      isTempClosed: store?.isTempClosed,
      opening_time: store?.opening_time,
      closing_time: store?.closing_time,
      latitude: store?.latitude,
      longitude: store?.longitude,
      avatar_url: store?.avatar_url,
      cover_image_url: store?.cover_image_url,
    });
  }, [store]);

  const handleFocus = (field) => {
    setEditingField(field);
  };

  const handleSave = async () => {
    try {
      if (editingField === "storeName") {
        const validatedName = validateFullName(editValue.name);
        if (validatedName) {
          toast.error(validatedName);
          return;
        }
      }
      if (
        editingField === "description" &&
        (editValue.description.length < 10 ||
          editValue.description.length > 500)
      ) {
        toast.error("Description must be between 10 and 500 characters long");
        return;
      }
      if (editingField === "contactNumber") {
        const validatedPhone = validatePhone(editValue.phone);
        if (validatedPhone) {
          toast.error(validatedPhone);
          return;
        }
      }
      const response = await storeService.updateStore(store.id, editValue);
      if (response.success) {
        toast.success(response.message);
        setStore((prev) => ({
          ...prev,
          ...editValue,
        }));
        setEditingField(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error has occurred: " + error);
    }
    setEditingField(null);
  };

  const handleSwitchChange = (checked) => {
    setEditValue((prev) => ({ ...prev, isTempClosed: !checked }));
    setEditingField("storeStatus");
  };

  const getLocation = async () => {
    try {
      const location = await storeLocationService.getCurrentLocation();
      const updated = {
        ...editValue,
        latitude: location.latitude,
        longitude: location.longitude,
      };
      setEditValue(updated);
      const response = await storeService.updateStore(store.id, updated);
      if (response.success) {
        toast.success("Your location is saved");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const imageUpload = async (file) => {
    try {
      if (!file) {
        toast.error("Please select an image file");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("StoreId", store?.id);
      let response;
      if (type === "avatar") {
        response = await imageService.uploadStoreAvatar(formData);
      } else {
        response = await imageService.uploadStoreCover(formData);
      }
      if (response.success) {
        toast.success("Image uploaded successfully");
        setEditValue((prev) => ({
          ...prev,
          avatar_url: response.data?.avatar_url || prev.avatar_url,
          cover_image_url:
            response.data?.cover_image_url || prev.cover_image_url,
        }));
        if (response.success) {
          setStore((prev) => ({
            ...prev,
            avatar_url: response.data?.avatar_url || prev.avatar_url,
            cover_image_url:
              response.data?.cover_image_url || prev.cover_image_url,
          }));
        } else {
          toast.error(response.message);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error has occurred: " + error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="space-y-2 py-4 max-w-6xl mx-auto w-full">
      <div>
        <div className="relative w-full h-70 mb-12">
          <img
            src={editValue.cover_image_url}
            alt="Cover"
            className="w-full h-70 object-cover rounded-lg hover:opacity-90 transition-opacity duration-300 cursor-pointer"
            onClick={() => {
              setOpen(true), setType("cover");
            }}
          />
          <div className="absolute left-1/2 -bottom-20 transform -translate-x-1/2">
            <img
              src={editValue.avatar_url}
              alt="Avatar"
              className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg bg-white hover:opacity-90 transition-opacity duration-300 cursor-pointer"
              onClick={() => {
                setOpen(true), setType("avatar");
              }}
            />
          </div>
        </div>
      </div>
      <p className="text-sm font-medium px-2 pt-2">Store Settings</p>
      <div className="space-y-0.5 rounded-lg border border-card overflow-hidden w-full">
        <FormTile
          icon={<DoorOpen />}
          title="Store Status"
          description="You can temporarily close your store to stop accepting orders"
          action={
            <div className="flex gap-2 items-end flex-col">
              <div className="flex items-center gap-2">
                <span>{!editValue.isTempClosed ? "Open" : "Closed"}</span>
                <Switch
                  checked={!editValue.isTempClosed}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
              {editingField === "storeStatus" && (
                <Button
                  size="sm"
                  onClick={() => handleSave("storeStatus")}
                  className="flex items-center"
                >
                  <Save size={16} className="mr-1" /> Save
                </Button>
              )}
            </div>
          }
        />
        <FormTile
          icon={<Clock />}
          title="Open Hours"
          description="System will automatically close your store at this time"
          action={
            <div className="w-72 flex gap-2 items-end flex-col">
              <div className="flex gap-2">
                <TimeField
                  id="openingTime"
                  label="Opening Time"
                  required={false}
                  value={editValue.opening_time || ""}
                  onChange={(e) =>
                    setEditValue((prev) => ({
                      ...prev,
                      opening_time: e.target.value,
                    }))
                  }
                  onFocus={() => handleFocus("openingHour")}
                />
                <TimeField
                  id="closingTime"
                  label="Closing Time"
                  required={false}
                  value={editValue.closing_time || ""}
                  onChange={(e) =>
                    setEditValue((prev) => ({
                      ...prev,
                      closing_time: e.target.value,
                    }))
                  }
                  onFocus={() => handleFocus("openingHour")}
                />
              </div>
              {editingField === "openingHour" && (
                <Button
                  size="sm"
                  onClick={() => handleSave("openingHour")}
                  className="flex items-center"
                >
                  <Save size={16} className="mr-1" /> Save
                </Button>
              )}
            </div>
          }
        />
      </div>

      <p className="text-sm font-medium px-2 pt-2">Basic Information</p>
      <div className="space-y-0.5 rounded-lg border border-card overflow-hidden w-full">
        <FormTile
          icon={<Store />}
          title="Name"
          description="A recognizable name for your store"
          action={
            <div className="w-64 flex gap-2 items-end flex-col">
              <Input
                id="name"
                value={editValue.name || ""}
                onChange={(e) =>
                  setEditValue((prev) => ({ ...prev, name: e.target.value }))
                }
                onFocus={() => handleFocus("storeName")}
              />
              {editingField === "storeName" && (
                <Button
                  size="sm"
                  onClick={() => handleSave("storeName")}
                  className="flex items-center"
                >
                  <Save size={16} className="mr-1" /> Save
                </Button>
              )}
            </div>
          }
        />
        <FormTile
          icon={<FileText />}
          title="About this store"
          description="Describe something about your store: history, mission, etc."
          action={
            <div className="w-72 flex gap-2 items-end flex-col">
              <Textarea
                id="description"
                value={editValue.description || ""}
                onChange={(e) =>
                  setEditValue((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                onFocus={() => handleFocus("description")}
                className="resize-none min-h-[60px]"
              />
              {editingField === "description" && (
                <Button
                  size="sm"
                  onClick={() => handleSave("description")}
                  className="flex items-center"
                >
                  <Save size={16} className="mr-1" /> Save
                </Button>
              )}
            </div>
          }
        />
        <FormTile
          icon={<MapPin />}
          title="Address"
          description="Set your store address"
          action={
            <div className="w-64 flex gap-2 items-end flex-col">
              <Input
                id="address"
                value={editValue.address || ""}
                onChange={(e) =>
                  setEditValue((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                onFocus={() => handleFocus("address")}
              />

              {editingField === "address" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleSave("address")}
                    className="flex items-center"
                  >
                    <Save size={16} className="mr-1" /> Save
                  </Button>
                </>
              )}
            </div>
          }
        />
        <FormTile
          icon={<MapPin />}
          title={
            editValue.latitude === null || editValue.longitude === null
              ? "Get your correct coordinate"
              : "Update your location"
          }
          description="Provide your location for accurate and timely delivery"
          action={
            <div className="w-64 flex gap-2 items-end flex-col">
              <Button
                size="sm"
                onClick={() => getLocation()}
                className="flex items-center"
              >
                <LocateIcon size={16} className="mr-1" />
                {editValue.latitude === null || editValue.longitude === null
                  ? "Get your correct coordinate"
                  : "Update your location"}
              </Button>
            </div>
          }
        />
        <FormTile
          icon={<Phone />}
          title="Phone"
          description="Customers can contact you via this number"
          action={
            <div className="w-64 flex gap-2 items-end flex-col">
              <Input
                id="contactNumber"
                value={editValue.phone || ""}
                onChange={(e) =>
                  setEditValue((prev) => ({ ...prev, phone: e.target.value }))
                }
                onFocus={() => handleFocus("contactNumber")}
              />
              {editingField === "contactNumber" && (
                <Button
                  size="sm"
                  onClick={() => handleSave("contactNumber")}
                  className="flex items-center"
                >
                  <Save size={16} className="mr-1" /> Save
                </Button>
              )}
            </div>
          }
        />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Upload Your Image</DialogTitle>
            <DialogDescription>
              Click on the image to upload a new one. Supported formats: JPG,
              PNG, GIF.
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="picture">Picture</Label>
          <Input ref={fileInputRef} type="file" id="picture" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => imageUpload(fileInputRef.current.files[0])}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StoreInforForm;
