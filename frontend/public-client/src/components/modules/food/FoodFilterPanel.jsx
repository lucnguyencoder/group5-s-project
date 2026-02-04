import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import React, { useEffect } from "react";
import { toast } from "sonner";
import {
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Navigation,
  Telescope,
  Truck,
} from "lucide-react";

function FoodFilterPanel({ filter, setFilter }) {
  const { deliveryAddresses, isAuthenticated } = useUser();

  const [selectedPrepTime, setSelectedPrepTime] = React.useState("");
  const [selectedPriceRange, setSelectedPriceRange] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState("none");

  const prepTimeOptions = [
    { id: "0-5", label: "0-5 mins", min: 0, max: 5, icon: Clock2 },
    { id: "5-10", label: "5-10 mins", min: 5, max: 10, icon: Clock3 },
    { id: "10-30", label: "10-30 mins", min: 10, max: 30, icon: Clock4 },
    { id: "30-60", label: "30-60 mins", min: 30, max: 60, icon: Clock5 },
  ];

  const priceRangeOptions = [
    { id: "0-30k", label: "0-30k", min: 0, max: 30000 },
    { id: "30k-50k", label: "30k-50k", min: 30000, max: 50000 },
    { id: "50-100k", label: "50-100k", min: 50000, max: 100000 },
    { id: "100-200k", label: "100-200k", min: 100000, max: 200000 },
  ];

  const handlePrepTimeSelect = (option) => {
    if (selectedPrepTime === option.id) {
      setSelectedPrepTime("");
      setFilter({
        ...filter,
        minPrepareTime: undefined,
        maxPrepareTime: undefined,
        page: 1,
      });
    } else {
      setSelectedPrepTime(option.id);
      setFilter({
        ...filter,
        minPrepareTime: option.min,
        maxPrepareTime: option.max,
        page: 1,
      });
    }
  };

  const handlePriceRangeSelect = (option) => {
    if (selectedPriceRange === option.id) {
      setSelectedPriceRange("");
      setFilter({
        ...filter,
        priceStart: undefined,
        priceEnd: undefined,
        page: 1,
      });
    } else {
      setSelectedPriceRange(option.id);
      setFilter({
        ...filter,
        priceStart: option.min,
        priceEnd: option.max,
        page: 1,
      });
    }
  };

  const handleLocationSelect = (locationType) => {
    if (locationType === "none") {
      setSelectedLocation("none");
      setFilter({
        ...filter,
        latitude: undefined,
        longitude: undefined,
        page: 1,
      });
    } else {
      setSelectedLocation(locationType);

      if (locationType === "current") {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setFilter({
                ...filter,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                page: 1,
              });
              toast.success("Location updated to your current position");
            },
            (error) => {
              toast.error(
                "Please allow location access for more accurate results"
              );
              console.log("Geolocation error:", error);
              setSelectedLocation("none");
            }
          );
        } else {
          toast.error("Geolocation is not supported by this browser");
          setSelectedLocation("none");
        }
      } else if (locationType === "delivery") {
        if (deliveryAddresses && deliveryAddresses.length > 0) {
          const defaultAddr = deliveryAddresses.find((addr) => addr.is_default);
          if (defaultAddr) {
            setFilter({
              ...filter,
              latitude: defaultAddr.latitude,
              longitude: defaultAddr.longitude,
              page: 1,
            });
            toast.success("Using delivery address location");
          }
        }
      }
    }
  };

  return (
    <div className="w-[20vw] space-y-6">
      <div>
        <Label className="text-2xl font-semibold">Search by</Label>
        <Input
          type="text"
          placeholder="Food name, description..."
          value={filter.search || ""}
          onChange={(e) =>
            setFilter({ ...filter, search: e.target.value, page: 1 })
          }
          className="w-full mt-2"
        />
      </div>

      <div>
        <Label className="text-lg font-semibold mb-3 block">
          Preparation Time
        </Label>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {prepTimeOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handlePrepTimeSelect(option)}
              className={`p-3 rounded-lg cursor-pointer text-center flex items-center justify-center transition-colors border-2 ${
                selectedPrepTime === option.id
                  ? "text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted border-border"
              }`}
            >
              <option.icon className="h-4 w-4 mr-2" />
              {option.label}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-lg font-semibold mb-3 block">Price Range</Label>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {priceRangeOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handlePriceRangeSelect(option)}
              className={`p-3 border-2 rounded-lg cursor-pointer  text-center transition-colors ${
                selectedPriceRange === option.id
                  ? "text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted border-border"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-lg font-semibold mb-3 block">Location</Label>
        <div className="grid grid-cols-1 gap-2">
          <div
            onClick={() => handleLocationSelect("none")}
            className={`p-3 border-2 rounded-lg cursor-pointer flex items-center justify-center text-center transition-colors ${
              selectedLocation === "none"
                ? "text-primary-foreground border-primary"
                : "bg-background hover:bg-muted border-border"
            }`}
          >
            <Telescope className="h-4 w-4 mr-2" />
            Discovery
          </div>

          <div
            onClick={() => handleLocationSelect("current")}
            className={`p-3 border-2 rounded-lg cursor-pointer flex items-center justify-center text-center transition-colors ${
              selectedLocation === "current"
                ? "text-primary-foreground border-primary"
                : "bg-background hover:bg-muted border-border"
            }`}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Use my current location
          </div>

          {isAuthenticated &&
            deliveryAddresses &&
            deliveryAddresses.length > 0 && (
              <div
                onClick={() => handleLocationSelect("delivery")}
                className={`p-3 border-2 rounded-lg cursor-pointer flex items-center justify-center text-center transition-colors ${
                  selectedLocation === "delivery"
                    ? "text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border"
                }`}
              >
                <Truck className="h-4 w-4 mr-2" />
                Use my delivery address
              </div>
            )}
        </div>
      </div>

      {/* <pre className="text-xs bg-muted p-2 rounded">
        <code>{JSON.stringify(filter, null, 2)}</code>
      </pre> */}
    </div>
  );
}

export default FoodFilterPanel;
