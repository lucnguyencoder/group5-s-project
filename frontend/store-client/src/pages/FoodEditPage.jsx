//done
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import FoodInfoForm from "@/components/modules/food/FoodInfoForm";
import FoodCustomizationForm from "@/components/modules/food/FoodCustomizationForm";
import {
  validateFoodForm,
  validateCustomizationGroup,
} from "@/utils/validators";
import { foodService } from "@/services/foodService";
import { Check, CircleAlert, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import SetTitle from "@/components/common/SetTitle";

const FoodEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [foodData, setFoodData] = useState({
    food_name: "",
    description: "",
    base_price: "",
    is_on_sale: false,
    sale_price: "",
    image_url: "",
    food_image: null,
    is_available: true,
    preparation_time: "",
    max_allowed_quantity: "",
    customization_groups: [],
  });

  const [errors, setErrors] = useState({});
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchFoodData();
    }
  }, [isEditing, id]);

  const fetchFoodData = async () => {
    try {
      const response = await foodService.getFoodById(id);
      if (response.success) {
        const foodData = response.data;
        setFoodData({
          food_name: foodData.food_name || "",
          description: foodData.description || "",
          base_price: foodData.base_price?.toString() || "",
          is_on_sale: foodData.is_on_sale || false,
          sale_price: foodData.sale_price?.toString() || "",
          image_url: foodData.image_url || "",
          food_image: null,
          is_available: foodData.is_available !== false,
          preparation_time: foodData.preparation_time?.toString() || "",
          max_allowed_quantity: foodData.max_allowed_quantity?.toString() || "",
          customization_groups: (foodData.customizationGroups || []).map(
            (group) => ({
              id: group.group_id,
              name: group.group_name,
              allowMultiple: group.max_selections > 1,
              required: group.is_required,
              minOptions: group.min_selections,
              maxOptions: group.max_selections,
              sort_order: group.sort_order,
              options: (group.options || []).map((option) => ({
                id: option.option_id,
                name: option.option_name,
                price: parseFloat(option.additional_price || 0),
                isDefault: option.is_default,
                sort_order: option.sort_order,
              })),
            })
          ),
        });
      } else {
        toast.error("Failed to load food data");
        navigate("/food");
      }
    } catch (error) {
      console.error("Error fetching food:", error);
      toast.error("Failed to load food data. Please try again later.");
      navigate("/food");
    }
  };

  const handleFoodDataChange = (newData) => {
    setFoodData(newData);

    if (errors.foodName && newData.food_name) {
      const newErrors = { ...errors };
      delete newErrors.foodName;
      setErrors(newErrors);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoodData((prev) => ({
        ...prev,
        food_image: file,
        image_url: URL.createObjectURL(file),
      }));
    }
  };

  const handleValidation = () => {
    let errorList = [];
    let hasErrors = false;
    const validation = validateFoodForm(foodData);

    if (!validation.isValid) {
      hasErrors = true;
      errorList.push(
        <>
          <p className="font-bold text-xs">In food basic data:</p>
          {Object.values(validation.errors).map((error) => (
            <div key={error} className="text-xs mt-1  text-destructive">
              <X className="w-3 h-3 inline" /> {error}
            </div>
          ))}
        </>
      );
    }

    foodData.customization_groups.forEach((group) => {
      const groupErrors = validateCustomizationGroup(group);
      if (Object.keys(groupErrors).length > 0) {
        hasErrors = true;
        errorList.push(
          <>
            <p className="font-bold text-xs">
              In {group.name || "Unnamed"} group:
            </p>
            <div>
              {Object.values(groupErrors).map((error, index) => (
                <div
                  key={index}
                  className="text-xs mt-1 flex items-center gap-1 text-destructive"
                >
                  <X className="w-3 h-3" /> {error}
                </div>
              ))}
            </div>
          </>
        );
      }
    });

    if (hasErrors) {
      let content = (
        <>
          <p className="text-sm font-medium">Please fix the following items:</p>
          <div className="mt-1 space-y-1">{errorList}</div>
        </>
      );
      return content;
    }
    return false;
  };
  const handleSave = async () => {
    let cnt = handleValidation();
    if (cnt) {
      toast.error(cnt);
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      let response;

      if (isEditing) {
        response = await foodService.updateFood(id, foodData);
      } else {
        response = await foodService.createFood(foodData);
      }

      if (response.success) {
        toast.success(
          isEditing
            ? "Food updated successfully!"
            : "Food created successfully!"
        );
        navigate("/food");
      } else {
        toast.error(response.message || "Failed to save food");
      }
    } catch (error) {
      console.error("Error saving food:", error);
      toast.error("An error occurred while saving the food");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SetTitle title={isEditing ? "Edit Food" : "Create New Food"} />
      <DataManagementLayout
        headerLeft={
          <h1 className="text-xl font-semibold">
            {isEditing ? "Edit Food" : "Create New Food"}
          </h1>
        }
        headerRight={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/food")}
              size="sm"
            >
              Cancel
            </Button>
            {handleValidation() && (
              <Popover>
                <PopoverTrigger>
                  <Button variant={"outline"} disabled={isSubmitting} size="sm">
                    <CircleAlert className="fill-destructive/30 text-destructive" />{" "}
                    View Issues
                  </Button>
                </PopoverTrigger>
                <PopoverContent>{handleValidation()}</PopoverContent>
              </Popover>
            )}
            <Button
              onClick={handleSave}
              disabled={isSubmitting || handleValidation()}
              size="sm"
            >
              {isSubmitting
                ? isEditing
                  ? "Updating"
                  : "Creating"
                : isEditing
                ? "Update"
                : "Create"}
            </Button>
          </div>
        }
        containScroll={true}
      >
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto p-4">
                <FoodInfoForm
                  formData={foodData}
                  onChange={handleFoodDataChange}
                  onImageChange={handleImageChange}
                />
              </div>
              {/* <pre>
                <code>{JSON.stringify(foodData)}</code>
              </pre> */}
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={50} minSize={30}>
            <FoodCustomizationForm
              foodData={foodData}
              setFoodData={setFoodData}
              editingGroup={editingGroup}
              setEditingGroup={setEditingGroup}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </DataManagementLayout>
    </>
  );
};

export default FoodEditPage;
