import React, { useState, useImperativeHandle, forwardRef } from "react";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import storeManagementService from "@/services/store/storeManagementService";
import {
  Store,
  User,
  Mail,
  Phone,
  Key,
  Building,
  Clock,
  MapPin,
  MessageSquare,
  Dice5,
  AlertCircleIcon,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TextField from "@/components/common/TextField";
import TimeField from "@/components/common/TimeField";
import LargeTextField from "@/components/common/LargeTextField";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  validateEmail,
  validateFullName,
  validatePhone,
} from "@/utils/validators";
import { formatName } from "@/utils/formatter";

const StoreCreateForm = forwardRef((props, ref) => {
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    opening_time: "09:00",
    closing_time: "22:00",
    latitude: null,
    longitude: null,
  });

  const [merchant, setMerchant] = useState({
    email: "",
    password: "",
    role: "manager",
    full_name: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    store: {},
    merchant: {},
  });

  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
    isLoading,
  }));

  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreData({
      ...storeData,
      [name]: value,
    });
  };

  const handleMerchantChange = (e) => {
    const { name, value } = e.target;
    setMerchant({
      ...merchant,
      [name]: value,
    });
  };

  const generateRandomPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";

    password += chars.substr(26, 1);
    password += chars.substr(0, 1);
    password += chars.substr(52, 1);
    password += chars.substr(62, 1);

    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    password = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    setMerchant({
      ...merchant,
      password: password,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      store: {},
      merchant: {},
    };

    if (!storeData.name || storeData.name.trim() === "") {
      newErrors.store.name = "Store name is required";
      isValid = false;
    }

    if (!merchant.email) {
      newErrors.merchant.email = "Email is required";
      isValid = false;
    } else if (validateEmail(merchant.email)) {
      newErrors.merchant.email = "Email is invalid";
      isValid = false;
    }

    if (!merchant.password) {
      newErrors.merchant.password = "Password is required";
      isValid = false;
    } else if (merchant.password.length < 8) {
      newErrors.merchant.password = "Password must be at least 8 characters";
      isValid = false;
    }

    const validatedName = validateFullName(merchant.full_name);
    if (validatedName) {
      newErrors.merchant.full_name = validatedName;
      isValid = false;
    }

    if (!merchant.phone) {
      newErrors.merchant.phone = "Phone number is required";
      isValid = false;
    }

    if (merchant.phone && validatePhone(merchant.phone)) {
      newErrors.merchant.phone = validatePhone(merchant.phone);
      isValid = false;
    }

    if (storeData.description && storeData.description.length > 500) {
      newErrors.store.description =
        "Description must be less than 500 characters";
      isValid = false;
    }

    if (storeData.address && storeData.address.length > 255) {
      newErrors.store.address = "Address must be less than 255 characters";
      isValid = false;
    }

    if (storeData.phone && validatePhone(storeData.phone)) {
      newErrors.store.phone = validatePhone(storeData.phone);
      isValid = false;
    }
    if (storeData.email && validateEmail(storeData.email)) {
      newErrors.store.email = validateEmail(storeData.email);
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return false;
    }

    setIsLoading(true);

    try {
      merchant.full_name = formatName(merchant.full_name);
      const payload = {
        storeData: storeData,
        merchant: merchant,
      };
      const result = await storeManagementService.createStore(payload);
      toast.success("Store created successfully!");
      return result;
    } catch (error) {
      toast.error(error.message || "Failed to create store. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-10">
      <div className="col-span-3 space-y-6">
        <div className="space-y-4">
          <TextField
            id="name"
            label="Store Name"
            name="name"
            value={storeData.name}
            onChange={handleStoreChange}
            icon={<Store />}
            error={errors.store.name}
            helpText="The display name of your store"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">
            Details
            <Badge variant="outline" className="ml-2">
              Optional
            </Badge>
          </h3>
          <div className="space-y-4">
            <LargeTextField
              id="description"
              label="Description"
              name="description"
              value={storeData.description}
              onChange={handleStoreChange}
              rows={4}
              icon={<MessageSquare />}
              placeholder="Brief description of your store..."
              required={false}
              error={errors.store.description}
              helpText="Tell customers about your store"
              showCharCount={true}
              maxLength={500}
            />

            <TextField
              id="address"
              label="Address"
              name="address"
              value={storeData.address}
              onChange={handleStoreChange}
              icon={<MapPin />}
              error={errors.store.address}
              helpText="Physical location of the store"
              required={false}
            />

            <div className="grid grid-cols-2 gap-4">
              <TextField
                id="phone"
                label="Phone Number"
                name="phone"
                value={storeData.phone}
                onChange={handleStoreChange}
                icon={<Phone />}
                error={errors.store.phone}
                helpText="Store contact number"
                required={false}
              />

              <TextField
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={storeData.email}
                onChange={handleStoreChange}
                icon={<Mail />}
                error={errors.store.email}
                helpText="Store contact email"
                required={false}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TimeField
                id="opening_time"
                label="Opening Time"
                name="opening_time"
                value={storeData.opening_time}
                onChange={handleStoreChange}
                icon={<Clock />}
                helpText="Store opening hours"
                required={false}
              />

              <TimeField
                id="closing_time"
                label="Closing Time"
                name="closing_time"
                value={storeData.closing_time}
                onChange={handleStoreChange}
                icon={<Clock />}
                helpText="Store closing hours"
                required={false}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Merchant account</h3>
          <Alert>
            <Info />
            <AlertTitle>About this account</AlertTitle>
            <AlertDescription>
              <p>
                The merchant account created here will be the primary manager
                for this store. From this account, the manager can configure
                store settings, manage products, and handle orders.
              </p>
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <TextField
              id="merchant-email"
              label="Email"
              name="email"
              type="email"
              value={merchant.email}
              onChange={handleMerchantChange}
              icon={<Mail />}
              error={errors.merchant?.email}
              helpText="Manager's login email"
            />

            <TextField
              id="merchant-password"
              label="Password"
              name="password"
              value={merchant.password}
              onChange={handleMerchantChange}
              icon={<Key />}
              isHideContent={true}
              error={errors.merchant?.password}
              helpText="Minimum 8 characters"
              rightItems={[
                <Button
                  key="generate"
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mr-24 p-0"
                  onClick={generateRandomPassword}
                >
                  <Dice5 className="h-3 w-3" />
                  Randomize
                </Button>,
              ]}
            />

            <TextField
              id="merchant-full_name"
              label="Full Name"
              name="full_name"
              value={merchant.full_name}
              onChange={handleMerchantChange}
              icon={<User />}
              error={errors.merchant?.full_name}
              helpText="Manager's display name"
            />

            <TextField
              id="merchant-phone"
              label="Phone Number"
              name="phone"
              value={merchant.phone}
              onChange={handleMerchantChange}
              icon={<Phone />}
              error={errors.merchant?.phone}
              helpText="Manager's contact number"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
});

StoreCreateForm.displayName = "StoreCreateForm";

export default StoreCreateForm;
