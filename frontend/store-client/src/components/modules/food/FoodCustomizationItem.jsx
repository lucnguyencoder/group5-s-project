//done
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Trash2,
  DollarSign,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import FormTile from "@/components/common/FormTile";
import TextField from "@/components/common/TextField";
import { Separator } from "@/components/ui/separator";

const FoodCustomizationItem = ({
  group,
  onDelete,
  onUpdate,
  canMoveUp,
  canMoveDown,
  onMoveGroup,
}) => {
  const handleGroupNameChange = (value) => {
    onUpdate(group.id, { name: value });
  };

  const handleAllowMultipleChange = (checked) => {
    onUpdate(group.id, {
      allowMultiple: checked,
      minOptions: checked ? group.minOptions : 1,
      maxOptions: checked ? group.maxOptions : 1,
      options: group.options.map((option) => ({ ...option, isDefault: false })),
    });
  };

  const handleRequiredChange = (checked) => {
    onUpdate(group.id, { required: checked });
  };

  const handleMinOptionsChange = (value) => {
    onUpdate(group.id, {
      minOptions: parseInt(value) || 0,
      options: group.options.map((option) => ({ ...option, isDefault: false })),
    });
  };

  const handleMaxOptionsChange = (value) => {
    onUpdate(group.id, {
      maxOptions: parseInt(value) || 1,
      options: group.options.map((option) => ({ ...option, isDefault: false })),
    });
  };

  const handleDefaultChange = (optionId, isDefault) => {
    let uo;
    if (group.allowMultiple) {
      uo = group.options.map((option) =>
        option.id === optionId ? { ...option, isDefault } : option
      );
    } else {
      uo = group.options.map((option) => ({
        ...option,
        isDefault: option.id === optionId ? isDefault : false,
      }));
    }
    onUpdate(group.id, { options: uo });
  };

  const handleAddOption = () => {
    const maxSortOrder = Math.max(
      0,
      ...group.options.map((o) => o.sort_order || 0)
    );
  
    let id = 0;

    if (group.options.length > 0) { 
      for (let i = 0; i < group.options.length; i++) {
        id = Math.max(id, group.options[i].id);
      }
    }

    const newOption = {
      id: id + 1,
      name: "",
      price: 0,
      isDefault: false,
      sort_order: maxSortOrder + 1,
    };
    onUpdate(group.id, {
      options: [...group.options, newOption],
    });
  };

  const handleUpdateOption = (optionId, updates) => {
    const uo = group.options.map((option) =>
      option.id === optionId ? { ...option, ...updates } : option
    );
    onUpdate(group.id, { options: uo });
  };

  const handleDeleteOption = (optionId) => {
    const uo = group.options.filter((option) => option.id !== optionId);
    onUpdate(group.id, { options: uo });
  };

  const handleMoveOption = (optionId, direction) => {
    const options = [...group.options].sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );

    const currentIndex = options.findIndex((o) => o.id === optionId);

    if (direction === "up" && currentIndex > 0) {
      [options[currentIndex], options[currentIndex - 1]] = [options[currentIndex - 1], options[currentIndex]];
    } else if (direction === "down" && currentIndex < options.length - 1) {
      [options[currentIndex], options[currentIndex + 1]] = [options[currentIndex + 1], options[currentIndex]];
    }

    const uo = options.map((option, index) => ({
      ...option,
      sort_order: index + 1,
    }));

    onUpdate(group.id, { options: uo });
  };

  const sortedOptions = [...group.options].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="space-y-0.5 rounded-lg overflow-hidden border">
      <FormTile
        disableChildPadding={false}
        title={group.name ? group.name : "Unnamed Group"}
        description={`${group.options.length} options • ${
          group.allowMultiple ? "Multiple selection" : "Single selection"
        }`}
        isExpanded={true}
        action={
          <div className="flex items-center gap-1">
            <div className="mr-2">
              {group.required ? (
                <Badge variant="default">Required</Badge>
              ) : (
                <Badge variant="outline">Optional</Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveGroup(group.id, "up")}
                disabled={!canMoveUp}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveGroup(group.id, "down")}
                disabled={!canMoveDown}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(group.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        }
        expand={
          <div className="space-y-0 -ml-7">
            <FormTile
              small
              background={false}
              title="Group Name"
              action={
                <div className="w-60">
                  <Input
                    value={group.name}
                    onChange={(e) => handleGroupNameChange(e.target.value)}
                    placeholder="Toppings, Extras, etc."
                  />
                </div>
              }
            />
            <FormTile
              small
              background={false}
              title="Selection Type"
              description="Allow single or multiple option selection"
              action={
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={group.allowMultiple}
                    onCheckedChange={handleAllowMultipleChange}
                  />
                  <Label>{group.allowMultiple ? "Multiple" : "Single"}</Label>
                </div>
              }
            />
            {group.allowMultiple && (
              <FormTile
                small
                background={false}
                title="Min / Max Options"
                description="Set the range of options customers can select"
                action={
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Min:</Label>
                      <Input
                        type="number"
                        min="0"
                        value={group.minOptions}
                        onChange={(e) => handleMinOptionsChange(e.target.value)}
                        placeholder="0"
                        className="w-16"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Max:</Label>
                      <Input
                        type="number"
                        min="1"
                        value={group.maxOptions}
                        onChange={(e) => handleMaxOptionsChange(e.target.value)}
                        placeholder="1"
                        className="w-16"
                      />
                    </div>
                  </div>
                }
              />
            )}
            <FormTile
              small
              background={false}
              title="Required"
              action={
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={group.required}
                    onCheckedChange={handleRequiredChange}
                  />
                  <Label>{group.required ? "On" : "Off"}</Label>
                </div>
              }
            />
            <Separator className="mt-2" />
            <FormTile
              background={false}
              title="Option Items"
              description="Configure individual options and their prices"
              action={
                <Button variant="outline" size="sm" onClick={handleAddOption}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              }
              isExpanded={true}
              expand={
                <div className="space-y-3 -py-3">
                  {sortedOptions.length === 0 ? (
                    <p className="text-sm font-medium mb-2">
                      No options available.
                    </p>
                  ) : (
                    sortedOptions.map((option, optionIndex) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-3 px-3 bg-secondary/1"
                      >
                        <>
                          <div className="flex items-center mr-2">
                            <Checkbox
                              checked={option.isDefault || false}
                              onCheckedChange={(checked) =>
                                handleDefaultChange(option.id, checked)
                              }
                              title={
                                group.allowMultiple
                                  ? "Default selection"
                                  : "Default selection (only one allowed)"
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <TextField
                              id={`option-name-${option.id}`}
                              label="Option Name"
                              value={option.name}
                              onChange={(e) =>
                                handleUpdateOption(option.id, {
                                  name: e.target.value,
                                })
                              }
                              placeholder="Enter option name"
                              required={false}
                            />
                          </div>
                          <div className="w-32">
                            <TextField
                              id={`option-price-${option.id}`}
                              label="Price"
                              type="number"
                              step="0.01"
                              min="0"
                              value={option.price}
                              onChange={(e) =>
                                handleUpdateOption(option.id, {
                                  price: parseFloat(e.target.value) || 0,
                                })
                              }
                              placeholder="0.00"
                              icon={<DollarSign />}
                              required={false}
                            />
                          </div>
                          <div className="flex items-center gap-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveOption(option.id, "up")}
                              disabled={optionIndex === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleMoveOption(option.id, "down")
                              }
                              disabled={
                                optionIndex === sortedOptions.length - 1
                              }
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOption(option.id)}
                              className="self-end mb-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      </div>
                    ))
                  )}
                </div>
              }
            />
          </div>
        }
      />
    </div>
  );
};

export default FoodCustomizationItem;
