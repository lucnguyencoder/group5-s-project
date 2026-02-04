import TabStyleSelection from "@/components/common/TabStyleSelection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

function StoreFilterPanel({ filter, setFilter }) {
  const { deliveryAddresses, isAuthenticated } = useUser();

  const [location, setLocation] = React.useState({
    latitude: null,
    longitude: null,
    isAuto: false,
  });

  const [includeClosedStores, setIncludeClosedStores] = React.useState(false);
  const [selectedAddressId, setSelectedAddressId] = React.useState("");

  useEffect(() => {
    if (deliveryAddresses && deliveryAddresses.length > 0) {
      const defaultAddr = deliveryAddresses.find((addr) => addr.is_default);
      if (defaultAddr) {
        const newLocation = {
          latitude: defaultAddr.latitude,
          longitude: defaultAddr.longitude,
          isAuto: true,
        };
        setLocation(newLocation);
        setSelectedAddressId(defaultAddr.address_id.toString());
        setFilter({
          ...filter,
          latitude: defaultAddr.latitude,
          longitude: defaultAddr.longitude,
        });
      }
    }
  }, [deliveryAddresses]);

  useEffect(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    setFilter((prev) => ({
      ...prev,
      currentTime: includeClosedStores ? undefined : currentTime,
      maxAllowedDistance: prev.maxAllowedDistance || 10,
    }));
  }, [includeClosedStores]);

  const handleAddressSelect = (addressId) => {
    const selectedAddr = deliveryAddresses.find(
      (addr) => addr.address_id === parseInt(addressId)
    );
    if (selectedAddr) {
      const newLocation = {
        latitude: selectedAddr.latitude,
        longitude: selectedAddr.longitude,
        isAuto: true,
      };
      setLocation(newLocation);
      setSelectedAddressId(addressId);
      setFilter({
        ...filter,
        latitude: selectedAddr.latitude,
        longitude: selectedAddr.longitude,
        page: 1,
      });
      toast.success("Delivery address updated");
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            isAuto: false,
          };
          setLocation(newLocation);
          setSelectedAddressId("");
          setFilter({
            ...filter,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            page: 1,
          });
          toast.success("Location updated to your current position");
        },
        (error) => {
          toast.error("Please allow location access for more accurate results");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };

  const handleDistanceChange = (e) => {
    setFilter({
      ...filter,
      maxAllowedDistance: parseInt(e.target.value) || 10,
      page: 1,
    });
  };

  const handleIncludeClosedStoresChange = (checked) => {
    setIncludeClosedStores(checked);
  };

  const showAddressSelect =
    isAuthenticated && deliveryAddresses && deliveryAddresses.length > 0;

  return (
    <div className="gap-2 w-[20vw]">
      <Label className="text-2xl font-semibold">Search by</Label>
      <Input
        type="text"
        placeholder="Store name, phone number, ..."
        value={filter.search || ""}
        onChange={(e) =>
          setFilter({ ...filter, search: e.target.value, page: 1 })
        }
        className="w-full max-w-md mb-4 mt-2"
      />
      <Label className="text-lg font-semibold mt-3">In your area</Label>
      {showAddressSelect && location.isAuto &&
        (!location.latitude ||
          !location.longitude ||
          location.latitude === undefined ||
          location.longitude === undefined) && (
          <Alert variant="destructive" className={"my-2"}>
            <AlertCircleIcon />
            <AlertTitle>We can not get exactly location</AlertTitle>
            <AlertDescription>
              <p>Please edit this delivery information and try again</p>
              <ul className="list-inside list-disc text-sm">
                <li>
                  Go to{" "}
                  <a href="/account#delivery" className="underline">
                    Manage my account {">"} Delivery Address
                  </a>
                </li>
                <li>Click 3 dots {">"} Edit</li>
                <li>
                  Click <strong>Get Current Location</strong> button and{" "}
                  <strong>Save</strong>
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      {showAddressSelect && (
        <>
          <Label className="text-sm font-medium opacity-75 -mb-1 mt-2">
            Delivery address
          </Label>
          <Select value={selectedAddressId} onValueChange={handleAddressSelect}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select delivery address" />
            </SelectTrigger>
            <SelectContent>
              {deliveryAddresses.map((addr) => (
                <SelectItem
                  key={addr.address_id}
                  value={addr.address_id.toString()}
                >
                  {addr.address_line}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label className="text-sm font-medium opacity-75 -mb-1 mt-3">
            Or use current location
          </Label>
        </>
      )}

      <Button
        variant="outline"
        onClick={handleCurrentLocation}
        className="w-full mt-2"
      >
        {!location.isAuto ? "Get current location" : "Move to current location"}
      </Button>
      <div className="flex items-center gap-2 mt-4 justify-between">
        <Label htmlFor="distance" className={"text-md font-semibold "}>
          Show stores which under
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="distance"
            type="number"
            min="1"
            max="50"
            value={filter.maxAllowedDistance || 10}
            onChange={handleDistanceChange}
            className="w-20"
          />
          <span className="text-md font-semibold">km</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 justify-between">
        <div>
          <Label htmlFor="include-closed" className={"text-md font-semibold "}>
            Include closed stores
          </Label>
          <div className="text-xs text-muted-foreground">
            Toggle to include stores that are currently closed.
          </div>
        </div>
        <Switch
          id="include-closed"
          checked={includeClosedStores}
          onCheckedChange={handleIncludeClosedStoresChange}
        />
      </div>
    </div>
  );
}

export default StoreFilterPanel;
