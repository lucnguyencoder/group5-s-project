//done
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FoodCustomizationItem from "./FoodCustomizationItem";

const FoodCustomizationForm = ({
  foodData,
  setFoodData,
  editingGroup,
  setEditingGroup,
}) => {
  const customizationGroups = foodData.customization_groups;

  const handleAddGroup = () => {
    const maxSortOrder = Math.max(
      0,
      ...customizationGroups.map((g) => g.sort_order || 0)
    );
    const newGroup = {
      id: Date.now(),
      name: "",
      allowMultiple: false,
      required: false,
      minOptions: 1,
      maxOptions: 1,
      sort_order: maxSortOrder + 1,
      options: [],
    };
    setFoodData({
      ...foodData,
      customization_groups: [...customizationGroups, newGroup],
    });
    setEditingGroup(newGroup.id);
  };

  const handleDeleteGroup = (groupId) => {
    setFoodData({
      ...foodData,
      customization_groups: customizationGroups.filter(
        (group) => group.id !== groupId
      ),
    });
    if (editingGroup === groupId) {
      setEditingGroup(null);
    }
  };

  const handleUpdateGroup = (groupId, updates) => {
    setFoodData({
      ...foodData,
      customization_groups: customizationGroups.map((group) =>
        group.id === groupId ? { ...group, ...updates } : group
      ),
    });
  };

  const sortedGroups = [...customizationGroups].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const onMoveGroup = (groupId, direction) => {
    const currentIdx = sortedGroups.findIndex((g) => g.id === groupId);
    let changed = [...sortedGroups];
    if (direction === "up" && currentIdx > 0) {
      [changed[currentIdx], changed[currentIdx - 1]] = [
        changed[currentIdx - 1],
        changed[currentIdx],
      ];
    } else if (direction === "down" && currentIdx < sortedGroups.length - 1) {
      [changed[currentIdx], changed[currentIdx + 1]] = [
        changed[currentIdx + 1],
        changed[currentIdx],
      ];
    }

    const updatedGroups = changed.map((group, index) => ({
      ...group,
      sort_order: index + 1,
    }));

    setFoodData({
      ...foodData,
      customization_groups: updatedGroups,
    });
  };
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-md font-semibold">Customize your dish</h2>
          <p className="text-sm text-muted-foreground">
            Create optional or required customizations for your food item
          </p>
        </div>
        <Button onClick={handleAddGroup} variant="secondary">
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {sortedGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-sm mx-auto">
              <h3 className="text-lg font-medium mb-2">
                No customization group available.
              </h3>
              <p className="text-muted-foreground mb-4">
                Add customization groups to let customers personalize their
                orders with options like size, toppings, or extras.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedGroups.map((group, index) => (
              <FoodCustomizationItem
                key={group.id}
                group={group}
                onDelete={handleDeleteGroup}
                onUpdate={handleUpdateGroup}
                canMoveUp={index > 0}
                canMoveDown={index < sortedGroups.length - 1}
                onMoveGroup={onMoveGroup}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCustomizationForm;
