import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Info, AlertCircle, ChevronDown, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SelectField({
  id,
  label,
  required = true,
  icon,
  error,
  helpText,
  containerProps,
  labelProps,
  className,
  value,
  options = [],
  multiple = false,
  placeholder = "Select...",
  defaultValue,
  onChange,
  onErrorClear,
  disabled = false,
  maxDisplayItems = 3,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [selectedValue, setSelectedValue] = useState(multiple ? [] : null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    } else if (defaultValue !== undefined) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const findSelectedOption = (val) => {
    for (const option of options) {
      if (option.value === val) return option;
      if (option.options) {
        const found = option.options.find((opt) => opt.value === val);
        if (found) return found;
      }
    }
    return null;
  };

  const getSelectedOptionLabel = () => {
    if (!isOpen && !hasValue) {
      return "";
    }

    if (multiple) {
      if (!selectedValue || selectedValue.length === 0) {
        return isOpen ? placeholder : "";
      }

      if (selectedValue.length <= maxDisplayItems) {
        return selectedValue
          .map((val) => {
            const option = findSelectedOption(val);
            return option ? option.display : val;
          })
          .join(", ");
      }

      return `${selectedValue.length} items selected`;
    } else {
      if (!selectedValue && !isOpen) {
        return "";
      }

      if (!selectedValue && isOpen) {
        return placeholder;
      }

      const option = findSelectedOption(selectedValue);
      return option ? option.display : selectedValue;
    }
  };

  const handleSelect = (option) => {
    if (multiple) {
      const newValues = selectedValue?.includes(option.value)
        ? selectedValue.filter((v) => v !== option.value)
        : [...(selectedValue || []), option.value];

      setSelectedValue(newValues);
      onChange?.(newValues);
    } else {
      setSelectedValue(option.value);
      onChange?.(option.value);
      setIsOpen(false);
      setIsFocused(false);
    }

    if (error && !hasEdited) {
      setHasEdited(true);
      onErrorClear?.(id);
    }
  };

  const isOptionSelected = (option) => {
    if (!selectedValue) return false;

    if (multiple) {
      return selectedValue.includes(option.value);
    } else {
      return selectedValue === option.value;
    }
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    setSelectedValue(multiple ? [] : null);
    onChange?.(multiple ? [] : null);
    setIsOpen(false);
    setIsFocused(false);
  };

  const hasValue = multiple
    ? selectedValue && selectedValue.length > 0
    : selectedValue !== null &&
      selectedValue !== undefined &&
      selectedValue !== "";

  const handleOpenChange = (open) => {
    setIsOpen(open);
    setIsFocused(open);
  };

  const renderOptions = () => {
    if (options.length === 0) {
      return (
        <div className="py-2 px-2 text-sm text-center text-muted-foreground">
          No options available
        </div>
      );
    }

    return options.map((option, index) => {
      if (option.label && !option.value) {
        return (
          <div key={`group-${index}`}>
            <div className="px-2 py-1 text-xs opacity-50 tracking-wider">
              {option.label}
            </div>
            {option.options?.map((subOption, subIndex) => (
              <div
                key={`${index}-${subIndex}`}
                onClick={() => handleSelect(subOption)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-muted/50 ",
                  isOptionSelected(subOption) &&
                    "bg-primary/30 hover:bg-primary/40"
                )}
              >
                {multiple && (
                  <Checkbox
                    checked={isOptionSelected(subOption)}
                    className="h-4 w-4"
                    tabIndex={-1}
                  />
                )}
                <span className="flex-1">{subOption.display}</span>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div
          key={index}
          onClick={() => handleSelect(option)}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-muted/50",
            isOptionSelected(option) && "bg-primary/30 hover:bg-primary/40"
          )}
        >
          {multiple && (
            <Checkbox
              checked={isOptionSelected(option)}
              className="h-4 w-4"
              tabIndex={-1}
            />
          )}
          <span className="flex-1">{option.display}</span>
        </div>
      );
    });
  };

  return (
    <div className="space-y-1" {...containerProps}>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "relative w-full cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && setIsOpen(true)}
          >
            <div
              className={cn(
                "flex items-center justify-between w-full h-14 pt-6 pb-2 px-4 rounded-md border border-input bg-transparent dark:bg-input/30 text-sm shadow-xs transition-all duration-200",
                !isOpen && "hover:bg-muted/40 dark:hover:bg-secondary/10",
                isOpen && "ring-[3px] ring-ring/50 border-ring",
                error &&
                  "border-destructive ring-destructive/20 dark:ring-destructive/40",
                icon && "pl-12",
                className
              )}
            >
              <div className="truncate text-base">
                {getSelectedOptionLabel()}
              </div>
              <div className="flex items-center gap-1">
                {hasValue && (
                  <div className="flex items-center justify-center -mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={disabled}
                      className="h-5 w-5 p-0 hover:bg-transparent opacity-75 hover:opacity-100 transition-opacity"
                      onClick={clearSelection}
                      tabIndex={-1}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-center">
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 opacity-50 transition-transform duration-200 -mt-4",
                      isOpen && "transform rotate-180"
                    )}
                  />
                </div>
              </div>
            </div>

            {icon && (
              <div className="absolute left-3.5 top-3/7 -translate-y-1/2 h-3 w-3 text-muted-foreground flex-shrink-0 scale-75">
                {icon}
              </div>
            )}

            {(helpText || error) && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {error && !hasEdited && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-transparent opacity-75 hover:opacity-100 transition-opacity"
                          tabIndex={-1}
                        >
                          <AlertCircle className="h-3 w-3 text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">{error}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}

            {label && (
              <Label
                htmlFor={id}
                {...labelProps}
                className={cn(
                  "absolute transition-all duration-200 pointer-events-none text-muted-foreground",
                  icon ? "left-12" : "left-4",
                  isFocused || hasValue
                    ? "top-1.5 text-xs font-medium"
                    : "top-1/2 -translate-y-1/2 text-sm opacity-75",
                  isFocused && "text-primary",
                  error && !hasEdited && "text-destructive",
                  labelProps?.className
                )}
              >
                {label}
                {required && " *"}
              </Label>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[var(--radix-dropdown-menu-trigger-width)] p-1 max-h-[200px] overflow-y-auto"
          align="start"
          side="bottom"
          sideOffset={8}
          alignOffset={0}
          avoidCollisions={true}
          collisionPadding={20}
          style={{
            overflowY: "auto",
            maxHeight: "200px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
          }}
        >
          {renderOptions()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SelectField;
