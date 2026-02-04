//done
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import FormTile from "@/components/common/FormTile";
import {
  UtensilsCrossed,
  FileText,
  Image,
  DollarSign,
  Clock,
  Package,
  Tag,
  ToggleLeft,
  Upload,
  X,
} from "lucide-react";

const FoodInfoForm = ({
  formData,
  onChange,
  onImageChange,
}) => {
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    onChange({
      ...formData,
      image_url: "",
      food_image: null,
    });
  };


  return (
    <div className="space-y-2">
      {/* <pre>
        <code>{JSON.stringify(formData, null, 2)}</code>
      </pre> */}
      <p className="text-sm font-medium px-2">Basics</p>
      <div className="space-y-0.5 rounded-lg overflow-hidden border border-card">
        <FormTile
          icon={<ToggleLeft className="h-5 w-5 text-muted-foreground" />}
          title="Availability"
          action={
            <div className="flex items-center space-x-2">
              <Switch
                id="is_available"
                checked={formData.is_available !== false}
                onCheckedChange={(checked) =>
                  handleInputChange("is_available", checked)
                }
              />
              {/* <Label htmlFor="is_available">Available</Label> */}
            </div>
          }
        />
        <FormTile
          icon={<UtensilsCrossed className="h-5 w-5 text-muted-foreground" />}
          title="Name"
          action={
            <div className="w-80">
              <Input
                id="food_name"
                value={formData.food_name || ""}
                onChange={(e) => {
                  handleInputChange("food_name", e.target.value);
                }}
                placeholder="Enter food name"
              />
            </div>
          }
        />

        <FormTile
          icon={<Image className="h-5 w-5 text-muted-foreground" />}
          title="Image"
          description="Allowed 5 MB maximum, JPG/PNG format"
          action={
            <div className="w-80">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={onImageChange}
              />
              <div
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-secondary/10 transition-colors"
                onClick={handleImageClick}
              >
                {formData.image_url ? (
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="mx-auto h-32 object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm">Click to upload an image</p>
                    <p className="text-xs text-muted-foreground">
                      size up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          }
        />
      </div>
      <p className="text-sm font-medium px-2 pt-2">Details</p>
      <div className="space-y-0.5 rounded-lg overflow-hidden border border-card">
        <FormTile
          icon={<FileText className="h-5 w-5 text-muted-foreground" />}
          title="Description"
          description="About your food"
          action={
            <div className="w-80">
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter food description"
                rows={3}
              />
            </div>
          }
        />

        <FormTile
          icon={<Clock className="h-5 w-5 text-muted-foreground" />}
          title="Preparation Time"
          description="in minutes"
          action={
            <div div className="flex flex-col items-end justify-end">
              <Input
                id="preparation_time"
                type="number"
                min="1"
                className="w-16"
                value={formData.preparation_time || ""}
                onChange={(e) =>
                  handleInputChange("preparation_time", e.target.value)
                }
                placeholder="15"
              />
            </div>
          }
        />
        <FormTile
          icon={<Package className="h-5 w-5 text-muted-foreground" />}
          title="Allowed Quantity"
          description="Maximum items per order"
          action={
            <div className="flex flex-col items-end justify-end">
              <Input
                id="max_allowed_quantity"
                type="number"
                min="1"
                className="w-16"
                value={formData.max_allowed_quantity || ""}
                onChange={(e) =>
                  handleInputChange("max_allowed_quantity", e.target.value)
                }
                placeholder="100"
              />
            </div>
          }
        />
      </div>
      <p className="text-sm font-medium px-2 pt-2">Price</p>
      <div className="space-y-0.5 rounded-lg overflow-hidden border border-card">
        <FormTile
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          title="Base Price"
          description="Set the regular price for this item"
          action={
            <div>
              <Input
                id="base_price"
                className={"w-40"}
                type="number"
                step="1000"
                min="0"
                value={formData.base_price || ""}
                onChange={(e) =>
                  handleInputChange("base_price", e.target.value)
                }
                placeholder="30000"
              />
              
            </div>
          }
        />
        <FormTile
          icon={<Tag className="h-5 w-5 text-muted-foreground" />}
          title="On Sale"
          description="Enable sale pricing for this item"
          isExpanded={formData.is_on_sale}
          action={
            <div className="flex items-center space-x-2">
              <Switch
                id="is_on_sale"
                checked={formData.is_on_sale || false}
                onCheckedChange={(checked) =>
                  handleInputChange("is_on_sale", checked)
                }
                size="xl"
              />
              <Label htmlFor="is_on_sale">
                {formData.is_on_sale ? "On" : "Off"}
              </Label>
            </div>
          }
          expand={
            formData.is_on_sale && (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="sale_price" className="font-medium">
                    Sale Price
                  </Label>
                  {/* <p className="text-sm text-muted-foreground">
                    Special discounted price
                  </p> */}
                </div>
                <div className="w-40">
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sale_price || ""}
                    onChange={(e) =>
                      handleInputChange("sale_price", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            )
          }
        />
      </div>
    </div>
  );
};

export default FoodInfoForm;
