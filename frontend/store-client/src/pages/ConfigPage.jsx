import FormTile from "@/components/common/FormTile";
import SetTitle from "@/components/common/SetTitle";
import BankSelectDialog from "@/components/modules/config/BankSelectDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { configService } from "@/services/configService";
import commonValidator from "@/utils/commonValidator";
import {
  ArrowDownToDot,
  ArrowUpToLine,
  BanknoteArrowUp,
  ChevronsDown,
  Landmark,
  RectangleEllipsis,
  ScanQrCode,
  Space,
  SquarePlus,
  Store,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

function ConfigPage() {
  const [config, setConfig] = useState(null);
  const [isChanged, setIsChanged] = useState();
  const [qrImageError, setQrImageError] = useState(false);
  const [err, setErr] = useState({});

  const initConfig = useRef(null);
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await configService.getConfig();
        console.log("Fetched config:", configData);
        setConfig(configData);
        initConfig.current = configData;
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (config) {
      if (JSON.stringify(config) !== JSON.stringify(initConfig.current)) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    }
  }, [config]);

  const validate = ({ form }) => {
    let err = {
      shipping_per_km_fee: "",
      minimum_shipping_fee: "",
      shipping_distance_limit: "",
      shipping_distance_to_calculate_fee: "",
      minimum_order_price: "",
      bank_number: "",
    };

    if (commonValidator.validateEmpty(form.shipping_per_km_fee)) {
      err.shipping_per_km_fee = "Shipping fee per kilometer is required";
    } else if (
      !commonValidator.validateNumber(form.shipping_per_km_fee, 100000, 0)
    ) {
      err.shipping_per_km_fee =
        "Shipping fee per kilometer must lower than 100.000";
    }

    if (commonValidator.validateEmpty(form.minimum_shipping_fee)) {
      err.minimum_shipping_fee = "Minimum shipping fee is required";
    } else if (
      !commonValidator.validateNumber(form.minimum_shipping_fee, 1000000, 0)
    ) {
      err.minimum_shipping_fee =
        "Minimum shipping fee must lower than 1.000.000";
    }
    if (commonValidator.validateEmpty(form.shipping_distance_limit)) {
      err.shipping_distance_limit = "Shipping distance limit is required";
    } else if (
      !commonValidator.validateNumber(form.shipping_distance_limit, 100, 0)
    ) {
      err.shipping_distance_limit =
        "Shipping distance limit must lower than 100";
    }
    if (
      commonValidator.validateEmpty(form.shipping_distance_to_calculate_fee)
    ) {
      err.shipping_distance_to_calculate_fee =
        "Shipping distance to calculate fee is required";
    } else if (
      !commonValidator.validateNumber(
        form.shipping_distance_to_calculate_fee,
        form.shipping_distance_limit,
        0
      )
    ) {
      err.shipping_distance_to_calculate_fee =
        "Shipping distance to calculate fee must lower than shipping distance limit";
    }
    if (commonValidator.validateEmpty(form.minimum_order_price)) {
      err.minimum_order_price = "Minimum order price is required";
    } else if (
      !commonValidator.validateNumber(form.minimum_order_price, 10000000, 1)
    ) {
      err.minimum_order_price =
        "Minimum order price must lower than 10.000.000 and greater than 1";
    }
    if (commonValidator.validateEmpty(form.bank_number)) {
      err.bank_number = "Bank account number is required";
    } else if (form.bank_number.length > 20) {
      err.bank_number = "Bank account number must be at most 20 characters";
    }

    if (commonValidator.validateEmpty(form.bank)) {
      err.bank = "Bank is required";
    }

    setErr(err);
  };

  useEffect(() => {
    if (config) {
      validate({ form: config });
    }
  }, [config]);

  const isNoErr = () => {
    for (let key in err) {
      if (err[key]) {
        return false;
      }
    }
    return true;
  };

  const updateConfig = async () => {
    try {
      const changedConfig = {};

      for (let key in config) {
        if (config[key] !== initConfig.current[key]) {
          changedConfig[key] = config[key];
        }
      }
      if (Object.keys(changedConfig).length > 0) {
        console.log("Changed config:", changedConfig);
        const response = await configService.updateConfig(changedConfig);

        if (response.success) {
          initConfig.current = { ...initConfig.current, ...changedConfig };
          setIsChanged(false);
        } else {
          console.error("Failed to update configuration:", response.message);
        }
      } else {
        setIsChanged(false);
        console.log("No changes to update.");
      }
    } catch (error) {
      console.error("Error updating configuration:", error);
    }
  };

  /**store_id":1,"shipping_per_km_fee":10000,"minimum_shipping_fee":20000,"shipping_distance_limit":10,"shipping_distance_to_calculate_fee":3,"minimum_order_price":10000000,"created_at":"2025-07-12 17:50:16","updated_at":"2025-07-12 17:50:16" */
  return (
    <div className="space-y-2 py-4 max-w-6xl mx-auto w-full">
      {/* {JSON.stringify(config)} */}
      <SetTitle title="Store Configuration" />
      <p className="text-sm font-medium px-2 pt-2">Shipping</p>
      <div className="space-y-0.5 rounded-lg border border-card overflow-hidden w-full">
        <FormTile
          icon={<BanknoteArrowUp />}
          title="Price per kilometer"
          description="Set the fee charged for each kilometer of delivery"
          action={
            <div className="flex flex-col items-end">
              <div className="w-32 flex gap-2 items-center">
                <Input
                  id="shipping_per_km_fee"
                  type="number"
                  step="1000"
                  min="0"
                  value={config?.shipping_per_km_fee || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      shipping_per_km_fee: e.target.value,
                    }))
                  }
                />
                <p>đ</p>
              </div>
              {err.shipping_per_km_fee && (
                <p className="text-destructive text-xs">
                  {err.shipping_per_km_fee}
                </p>
              )}
            </div>
          }
        />
        <FormTile
          title="Minimum shipping fee"
          icon={<ChevronsDown />}
          description="Set the minimum fee charged for delivery"
          action={
            <div className="flex flex-col items-end">
              <div className="w-32 flex gap-2 items-center">
                <Input
                  id="minimum_shipping_fee"
                  type="number"
                  step="1000"
                  min="0"
                  value={config?.minimum_shipping_fee || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      minimum_shipping_fee: e.target.value,
                    }))
                  }
                />
                <p>đ</p>
              </div>
              {err.minimum_shipping_fee && (
                <p className="text-destructive text-xs">
                  {err.minimum_shipping_fee}
                </p>
              )}
            </div>
          }
        />
        <FormTile
          icon={<ArrowUpToLine />}
          title="Distance limit for shipping"
          description="Over this distance, shipping is not available"
          action={
            <div className="flex flex-col items-end">
              <div className="w-32 flex gap-2 items-center">
                <Input
                  id="shipping_distance_limit"
                  type="number"
                  step="1"
                  min="0"
                  value={config?.shipping_distance_limit || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      shipping_distance_limit: e.target.value,
                    }))
                  }
                />
                <p>km</p>
              </div>
              {err.shipping_distance_limit && (
                <p className="text-destructive text-xs">
                  {err.shipping_distance_limit}
                </p>
              )}
            </div>
          }
        />
        <FormTile
          icon={<SquarePlus />}
          title="Distance to calculate fee"
          description="Set the distance from which shipping fees are calculated"
          action={
            <div className="flex flex-col items-end">
              <div className="w-32 flex gap-2 items-center">
                <Input
                  id="shipping_distance_to_calculate_fee"
                  type="number"
                  step="1"
                  min="0"
                  value={config?.shipping_distance_to_calculate_fee || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      shipping_distance_to_calculate_fee: e.target.value,
                    }))
                  }
                />
                <p>km</p>
              </div>
              {err.shipping_distance_to_calculate_fee && (
                <p className="text-destructive text-xs">
                  {err.shipping_distance_to_calculate_fee}
                </p>
              )}
            </div>
          }
        />
      </div>
      <p className="text-sm font-medium px-2 pt-2">Order</p>
      <div className="space-y-0.5 rounded-lg border border-card overflow-hidden w-full">
        <FormTile
          icon={<Store />}
          title="Pickup orders"
          description="Customer can choose to pick up their orders instead of delivery"
          action={
            <Switch
              id="allow_pick_up"
              checked={config?.allow_pick_up || false}
              onCheckedChange={(checked) => {
                setConfig((prev) => ({
                  ...prev,
                  allow_pick_up: checked,
                }));
              }}
            />
          }
        />
        <FormTile
          icon={<ArrowDownToDot />}
          title="Minimum order price"
          description="Set the minimum order price for delivery"
          action={
            <div className="flex flex-col items-end">
              <div className="w-32 flex gap-2 items-center">
                <Input
                  id="minimum_order_price"
                  type="number"
                  step="1000"
                  min="0"
                  value={config?.minimum_order_price || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      minimum_order_price: e.target.value,
                    }))
                  }
                />
                <p>đ</p>
              </div>
              {err.minimum_order_price && (
                <p className="text-destructive text-xs">
                  {err.minimum_order_price}
                </p>
              )}
            </div>
          }
        />
      </div>
      <p className="text-sm font-medium px-2 pt-2">Payment</p>
      <div className="space-y-0.5 rounded-lg border border-card overflow-hidden w-full">
        <FormTile
          icon={<Landmark />}
          title="Beneficiary Bank"
          description="This is the bank that will receive your payments. Please make sure the name is accurate to avoid failed transactions."
          action={
            <BankSelectDialog
              current_bank={config?.bank || "Select Bank"}
              onChange={(bank) => {
                setConfig((prev) => ({ ...prev, bank }));
                setQrImageError(false);
              }}
            />
          }
        />
        <FormTile
          icon={<RectangleEllipsis />}
          title="Account Number"
          description="Customers will transfer money to this account. Double-check for typos."
          action={
            <div className="flex flex-col items-end">
              <div className="w-48 flex gap-2 items-center">
                <Input
                  id="bank_number"
                  type="text"
                  value={config?.bank_number || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      bank_number: e.target.value,
                    }))
                  }
                />
              </div>
              {err.bank_number && (
                <p className="text-destructive text-xs">{err.bank_number}</p>
              )}
            </div>
          }
        />
        <FormTile
          icon={<ScanQrCode />}
          title="QR Code Preview"
          description="Please test the QR code to ensure it works correctly. If you encounter issues, please contact support. QR Code provided by Sepay."
          action={
            qrImageError ? (
              <div
                className="w-32 h-32 flex items-center justify-center bg-muted rounded border"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <p className="text-sm text-muted-foreground text-center">
                  Error loading QR code. Please try again.
                </p>
              </div>
            ) : (
              <img
                src={`https://qr.sepay.vn/img?acc=${config?.bank_number}&template=qronly&bank=${config?.bank}&des=This+is+a+test+QR+code`}
                onError={() => setQrImageError(true)}
                onLoad={() => setQrImageError(false)}
                alt="QR Code"
                className="max-w-32 max-h-32"
              />
            )
          }
        />
        {/* <pre>
          <code>{JSON.stringify(config, null, 2)}</code>
        </pre> */}
      </div>
      <div
        className={`fixed bottom-4 left-1/2 transform transition-transform duration-300 bg-card border py-2 rounded-lg pl-3 pr-2 flex gap-3 items-center shadow-lg w-2/5 justify-between ${
          isChanged
            ? "-translate-x-1/2 -translate-y-1"
            : "-translate-x-1/2 translate-y-30"
        }`}
      >
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            Be careful! - It seems you have unsaved changes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="link"
            onClick={() => {
              setConfig(initConfig.current);
              setIsChanged(false);
            }}
          >
            Discard it
          </Button>
          <Button
            variant="default"
            onClick={updateConfig}
            disabled={!isNoErr()}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfigPage;
