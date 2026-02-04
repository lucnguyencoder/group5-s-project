import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  X,
  RefreshCw,
  Clock,
  DollarSign,
  Package,
  Tag,
  Eye,
  EyeOff,
  FileText,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pen,
  ShoppingBasket,
  Image,
} from "lucide-react";
import { foodService } from "@/services/foodService";
import { formatCurrency } from "@/utils/formatter";
import InformationTile from "@/components/common/InformationTile";
import { useUser } from "@/context/UserContext";
import PrivateComponents from "@/components/layout/PrivateComponents";

const FoodDetailPanel = ({ foodId, onFoodIdChange }) => {
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false);

  const { user } = useUser();

  const fetchFoodDetails = async () => {
    if (!foodId) return;

    setLoading(true);
    try {
      const response = await foodService.getFoodById(foodId);
      if (response.success) {
        // console.log("Fetched food details:", response);
        setFood(response.data);
        setError(null);
      } else {
        setError(response.message || "Failed to load food details");
        setFood(null);
      }
    } catch (err) {
      console.error("Error fetching food details:", err);
      setError("Failed to load food details. Please try again later.");
      setFood(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (foodId) {
      fetchFoodDetails();
    } else {
      setFood(null);
    }
  }, [foodId]);

  const handleEditFood = () => {
    if (food) {
      navigate(`/food/edit/${food.food_id}`);
    }
  };

  const handleClose = () => {
    if (onFoodIdChange) {
      onFoodIdChange(null);
    }
  };

  if (!foodId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="text-muted-foreground">
          <p className="mt-1 text-sm text-muted-foreground">
            Select a food from the list to quick view its details.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Please wait</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="text-destructive mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium">Error loading food details</h3>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={fetchFoodDetails}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="text-muted-foreground">
          <h3 className="text-sm font-medium text-muted-foreground">
            Food not found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The selected food could not be found or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Details</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
            Close
          </Button>
          <PrivateComponents url="/api/store/foods/:foodId" method="PUT">
            <Button variant="secondary" size="sm" onClick={handleEditFood}>
              <Pen className="h-4 w-4 " />
              Edit
            </Button>
          </PrivateComponents>
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              window.open(
                `http://localhost:3001/food/${food.food_id}`,
                "_blank"
              )
            }
          >
            <ShoppingBasket />
            View in store
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="mb-6">
            <p className="text-md font-semibold mb-2">About</p>
            <div className="space-y-0.5 rounded-lg overflow-hidden border border-card">
              <InformationTile
                icon={<Image className="h-5 w-5 text-muted-foreground" />}
                title="Image"
                action={
                  <span className="text-md">
                    <img
                      src={food.image_url || "/placeholder-food.jpg"}
                      alt={food.food_name}
                      className="w-full max-h-40 rounded-md object-cover"
                    />
                  </span>
                }
              />

              <InformationTile
                icon={<Tag className="h-5 w-5 text-muted-foreground" />}
                title="Name"
                action={<span className="text-md">{food.food_name}</span>}
              />
              <InformationTile
                icon={<Eye className="h-5 w-5 text-muted-foreground" />}
                title="Availability"
                action={
                  <span
                    className={`text-sm ${
                      food.is_available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {food.is_available ? "Available" : "Unavailable"}
                  </span>
                }
              />
              <InformationTile
                icon={<Clock className="h-5 w-5 text-muted-foreground" />}
                title="Preparation Time"
                action={
                  <span className="text-md">{food.preparation_time} min</span>
                }
              />
              <InformationTile
                icon={<Package className="h-5 w-5 text-muted-foreground" />}
                title="Max Quantity"
                action={
                  <span className="text-md">{food.max_allowed_quantity}</span>
                }
              />
              <InformationTile
                icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
                title="Base Price"
                action={
                  <span className="text-md">
                    {formatCurrency(food.base_price)}
                  </span>
                }
              />
              {food.is_on_sale && (
                <InformationTile
                  icon={<Tag className="h-5 w-5 text-muted-foreground" />}
                  title="Sale Price"
                  action={
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(food.sale_price)}
                    </span>
                  }
                />
              )}
              {food.description && (
                <InformationTile
                  icon={<FileText className="h-5 w-5 text-muted-foreground" />}
                  title="Description"
                  action={
                    <div className="flex flex-col w-full">
                      {showDescription ? (
                        <span className="text-md">{food.description}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {food.description}
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="self-end mt-3 text-xs p-0.5 "
                        onClick={() => setShowDescription(!showDescription)}
                      >
                        {showDescription ? (
                          <ChevronUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ChevronDown className="h-3 w-3 mr-1" />
                        )}
                        {showDescription ? "Collapse" : "Expand"}
                      </Button>
                    </div>
                  }
                />
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Options</h2>

            {food.customizationGroups && food.customizationGroups.length > 0 ? (
              <div className="space-y-4">
                {food.customizationGroups.map((group) => (
                  <div
                    key={group.group_id}
                    className="border rounded-lg p-4 bg-sidebar border-card"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{group.group_name}</h3>
                      <div className="flex gap-1">
                        {group.is_required && <Badge>Required</Badge>}
                        <Badge variant="outline">
                          {group.max_selections > 1 ? "Multiple" : "Single"}{" "}
                          Selection
                        </Badge>
                        {group.max_selections > 1 && (
                          <Badge variant="outline">
                            Limit{" "}
                            {group.min_selections === group.max_selections
                              ? `exactly ${group.min_selections}`
                              : `${group.min_selections} to ${group.max_selections}`}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                      {group.options.map((option) => (
                        <div
                          key={option.option_id}
                          className="flex justify-between items-start py-2 px-4 bg-secondary/10 rounded-md"
                        >
                          <div className="flex items-center">
                            {option.is_default && (
                              <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                            )}
                            <span>{option.option_name}</span>
                          </div>
                          <span className="text-sm mt-0.5">
                            {option.additional_price > 0
                              ? `+${formatCurrency(option.additional_price)}`
                              : "Free"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No customization options available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPanel;
