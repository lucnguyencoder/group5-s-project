import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  MapPin,
  User,
  Phone,
  MapPinned,
  Loader2,
  LocateFixed,
  MapPinPlus,
  Edit,
  RefreshCcw,
} from "lucide-react";
import TextField from "@/components/common/TextField";
import DrawerSelect from "@/components/common/DrawerSelect";
import {
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
  getCurrentLocation,
} from "@/services/locationService";
import { useUser } from "@/context/UserContext";

function LocationForm({
  open,
  onOpenChange,
  onSave,
  editMode = false,
  locationId = null,
  initialData = null,
}) {
  const { addLocation, updateLocation: updateUserLocation } = useUser();
  const [formData, setFormData] = useState({
    recipient_name: "",
    phone: "",
    address_line: "",
    ward_code: "",
    district_code: "",
    province_code: "",
    is_default: false,
    latitude: null,
    longitude: null,
    province_name: "",
    district_name: "",
    ward_name: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [isTouched, setIsTouched] = useState({});

  const [isReplacingLocation, setIsReplacingLocation] = useState(false);


  useEffect(() => {
    if (open && editMode && initialData) {
      loadInitialData();
    }
  }, [open, editMode, initialData]);

  useEffect(() => {
    if (!open) {
      setIsReplacingLocation(false);

      if (!editMode) {
        setFormData({
          recipient_name: "",
          phone: "",
          address_line: "",
          ward_code: "",
          district_code: "",
          province_code: "",
          is_default: false,
          latitude: null,
          longitude: null,
          province_name: "",
          district_name: "",
          ward_name: "",
        });
      }
    }
  }, [open]);

  const loadInitialData = () => {
    if (initialData) {
      setFormData({
        recipient_name: initialData.recipient_name || "",
        phone: initialData.recipient_phone || "",
        address_line: initialData.address_line || "",
        ward_code: initialData.ward_code || "",
        district_code: initialData.district_code || "",
        province_code: initialData.province_code || "",
        is_default: initialData.is_default || false,
        latitude: initialData.latitude
          ? parseFloat(initialData.latitude)
          : null,
        longitude: initialData.longitude
          ? parseFloat(initialData.longitude)
          : null,
        province_name: initialData.province_name || "",
        district_name: initialData.district_name || "",
        ward_name: initialData.ward_name || "",
        recipient_phone: initialData.recipient_phone || "",
      });

      fetchProvinces();
    }
  };

  const fetchProvinces = async () => {
    const data = await getProvinces();
    setProvinces(data);
  };

  const fetchDistricts = async (provinceCode) => {
    const data = await getDistrictsByProvince(provinceCode);
    setDistricts(data);
  };

  const fetchWards = async (districtCode) => {
    const data = await getWardsByDistrict(districtCode);
    setWards(data);
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (formData.province_code) {
      const fetchDistrictsData = async () => {
        setDistricts([]);
        if (!isReplacingLocation && editMode) return;

        setFormData((prev) => ({
          ...prev,
          district_code: "",
          ward_code: "",
          district_name: "",
          ward_name: "",
        }));

        await fetchDistricts(formData.province_code);
      };

      fetchDistrictsData();
    }
  }, [formData.province_code, isReplacingLocation]);

  useEffect(() => {
    if (formData.district_code) {
      const fetchWardsData = async () => {
        setWards([]);
        if (!isReplacingLocation && editMode) return;

        setFormData((prev) => ({
          ...prev,
          ward_code: "",
          ward_name: "",
        }));

        await fetchWards(formData.district_code);
      };

      fetchWardsData();
    }
  }, [formData.district_code, isReplacingLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (!isTouched[name]) {
      setIsTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (value, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (!isTouched[field]) {
      setIsTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
    }

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    if (field === "province_code") {
      const selectedProvince = provinces.find((p) => p.code === value);
      if (selectedProvince) {
        setFormData((prev) => ({
          ...prev,
          province_name: selectedProvince.display,
          district_code: "",
          district_name: "",
          ward_code: "",
          ward_name: "",
        }));
      }
    } else if (field === "district_code") {
      const selectedDistrict = districts.find((d) => d.code === value);
      if (selectedDistrict) {
        setFormData((prev) => ({
          ...prev,
          district_name: selectedDistrict.display,
          ward_code: "",
          ward_name: "",
        }));
      }
    } else if (field === "ward_code") {
      const selectedWard = wards.find((w) => w.code === value);
      if (selectedWard) {
        setFormData((prev) => ({ ...prev, ward_name: selectedWard.display }));
      }
    }
  };

  const handleGetLocation = async () => {
    setIsLocationLoading(true);
    try {
      const { latitude, longitude } = await getCurrentLocation();

      setFormData((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
    } catch (error) {
      toast.error(
        "Failed to get your location. Please check permissions and try again."
      );
      console.error(error);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleReplaceLocation = () => {
    setIsReplacingLocation(true);

    setFormData((prev) => ({
      ...prev,
      address_line: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recipient_name.trim()) {
      newErrors.recipient_name = "Recipient name is required";
    }

    if (!formData.phone && !formData.recipient_phone) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneValue = formData.phone || formData.recipient_phone;
      if (!/^(0)\d{9,10}$/.test(phoneValue)) {
        newErrors.phone = "Invalid phone number format";
      }
    }

    if (!formData.address_line.trim()) {
      newErrors.address_line = "Address is required";
    }

    if (isReplacingLocation || !editMode) {
      if (!formData.province_code) {
        newErrors.province_code = "Province is required";
      }

      if (!formData.district_code) {
        newErrors.district_code = "District is required";
      }

      if (!formData.ward_code) {
        newErrors.ward_code = "Ward is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      let fullAddressLine;

      if (isReplacingLocation || !editMode) {
        fullAddressLine = [
          formData.address_line,
          formData.ward_name,
          formData.district_name,
          formData.province_name,
        ]
          .filter(Boolean)
          .join(", ");
      } else {
        fullAddressLine = initialData.address_line;
      }

      const locationData = {
        ...formData,
        address_line: fullAddressLine,
        recipient_phone: formData.phone || formData.recipient_phone,
      };

      let response;

      if (editMode) {
        response = await updateUserLocation(locationId, locationData);
      } else {
        response = await addLocation(locationData);
      }

      if (response.success) {
        toast.success(
          editMode
            ? "Location updated successfully"
            : "Location saved successfully"
        );

        if (onSave) {
          onSave(response.data);
        }

        onOpenChange(false);
      } else {
        toast.error(
          response.message ||
          `Failed to ${editMode ? "update" : "save"} location`
        );
      }
    } catch (error) {
      toast.error(`Failed to ${editMode ? "update" : "save"} location`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction="right"
      className="z-40"
    >
      <DrawerContent className="overflow-auto overflow-x-none z-999">
        <div className="px-4 pt-4 overflow-x-none">
          <DrawerTitle className="text-2xl ">
            {editMode ? "Edit Address" : "Add New Address"}
          </DrawerTitle>

          <div className="space-y-4 my-4 overflow-x-none">
            <Button
              className="w-full"
              onClick={handleGetLocation}
              disabled={isLocationLoading}
            >
              {isLocationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="h-4 w-4" />
              )}
              Get Exact Location (Required)
            </Button>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Location
                </h3>
              </div>
              {editMode && !isReplacingLocation && initialData && (
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Current Address</h4>
                      <p className="text-sm text-muted-foreground break-words">
                        {initialData.address_line}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReplaceLocation}
                      className="h-8"
                    >
                      <RefreshCcw className="h-3 w-3 mr-2" />
                      Replace
                    </Button>
                  </div>
                </div>
              )}
              {(!editMode || isReplacingLocation) && (
                <div className="space-y-3 overflow-visible">
                  <DrawerSelect
                    id="province_code"
                    label="Province"
                    value={formData.province_code}
                    options={provinces}
                    onChange={(value) =>
                      handleSelectChange(value, "province_code")
                    }
                    error={errors.province_code}
                    icon={<MapPinned className="h-5 w-5" />}
                    placeholder="Select province"
                    drawerTitle="Select Province"
                    searchPlaceholder="Search provinces..."
                    required
                  />

                  <DrawerSelect
                    id="district_code"
                    label="District"
                    value={formData.district_code}
                    options={districts}
                    onChange={(value) =>
                      handleSelectChange(value, "district_code")
                    }
                    error={errors.district_code}
                    icon={<MapPinned className="h-5 w-5" />}
                    placeholder="Select district"
                    drawerTitle="Select District"
                    searchPlaceholder="Search districts..."
                    disabled={!formData.province_code || districts.length === 0}
                    required
                  />

                  <DrawerSelect
                    id="ward_code"
                    label="Ward"
                    value={formData.ward_code}
                    options={wards}
                    onChange={(value) => handleSelectChange(value, "ward_code")}
                    error={errors.ward_code}
                    icon={<MapPinned className="h-5 w-5" />}
                    placeholder="Select ward"
                    drawerTitle="Select Ward"
                    searchPlaceholder="Search wards..."
                    disabled={!formData.district_code || wards.length === 0}
                    required
                  />

                  <TextField
                    id="address_line"
                    name="address_line"
                    label="Detailed Location"
                    value={formData.address_line}
                    onChange={handleChange}
                    error={errors.address_line}
                    onErrorClear={clearError}
                    placeholder="House number, street name, etc."
                    required
                  />
                </div>
              )}

              {formData.latitude && formData.longitude && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">GPS Coordinates:</span>{" "}
                  {formData.latitude.toFixed(6)},{" "}
                  {formData.longitude.toFixed(6)}
                </div>
              )}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            <TextField
              id="recipient_name"
              name="recipient_name"
              label="Recipient Name"
              value={formData.recipient_name}
              onChange={handleChange}
              error={errors.recipient_name}
              onErrorClear={clearError}
              icon={<User className="h-5 w-5" />}
              required
            />

            <TextField
              id="phone"
              name="phone"
              label="Phone Number"
              value={formData.phone || formData.recipient_phone}
              onChange={handleChange}
              error={errors.phone}
              onErrorClear={clearError}
              icon={<Phone className="h-5 w-5" />}
              helpText="Enter a valid Vietnamese phone number (e.g., 0912345678)"
              required
            />
          </div>

          <DrawerFooter className="px-0 pt-4">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editMode ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  {editMode ? (
                    <Edit className="mr-2 h-4 w-4" />
                  ) : (
                    <MapPinPlus className="mr-2 h-4 w-4" />
                  )}
                  {editMode ? "Update Address" : "Save Address"}
                </>
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default LocationForm;
