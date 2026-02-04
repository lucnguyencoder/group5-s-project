import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ChevronDown,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DateField({
  id,
  label,
  required = true,
  icon = <CalendarIcon />,
  error,
  helpText,
  containerProps,
  labelProps,
  className,
  value,
  placeholder = "Select date...",
  onChange,
  onErrorClear,
  disabled = false,
  dateFormat = "dd/MM/yyyy",
  minDate,
  maxDate,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Initialize from value
  useEffect(() => {
    if (value) {
      setSelectedDate(value instanceof Date ? value : new Date(value));
    }
  }, []);

  // Track external value changes
  useEffect(() => {
    if (value) {
      setSelectedDate(value instanceof Date ? value : new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";

    try {
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Get display text
  const getDisplayDate = () => {
    if (!isOpen && !hasValue) {
      return "";
    }

    if (!selectedDate && isOpen) {
      return placeholder;
    }

    return selectedDate ? formatDate(selectedDate) : "";
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
    setIsFocused(false);

    if (error && !hasEdited) {
      setHasEdited(true);
      onErrorClear?.(id);
    }
  };

  // Clear selection
  const clearSelection = (e) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange?.(null);
    setIsOpen(false);
    setIsFocused(false);
  };

  // Check if date is selected
  const hasValue = selectedDate !== null && selectedDate !== undefined;

  // Handle focus when dropdown opens/closes
  const handleOpenChange = (open) => {
    setIsOpen(open);
    setIsFocused(open);
  };

  return (
    <div className="space-y-1" {...containerProps}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
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
              <div className="truncate text-base">{getDisplayDate()}</div>
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
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 shadow-md" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            captionLayout="dropdown"
            {...rest}
          />
        </PopoverContent>
      </Popover>
      {error && !hasEdited && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

export default DateField;
