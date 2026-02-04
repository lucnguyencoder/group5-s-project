import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Info, AlertCircle, Clock, ChevronUp, ChevronDown } from "lucide-react";
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

function TimeField({
  id,
  label,
  required = true,
  icon,
  error,
  helpText,
  containerProps,
  labelProps,
  inputProps = {},
  className,
  value,
  rightItems = [],
  onChange,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [timeError, setTimeError] = useState({ hours: null, minutes: null });
  const hasValue = value !== undefined && value !== null && value !== "";
  const isFloating = isFocused || hasValue;

  // Time picker state
  const [timeValue, setTimeValue] = useState(() => {
    if (value) {
      const [hours, minutes] = value.split(":");
      const hour12 = parseInt(hours) % 12 || 12;
      const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
      return {
        hours: hour12.toString().padStart(2, "0"),
        minutes: minutes || "00",
        ampm: ampm,
      };
    }
    return { hours: "12", minutes: "00", ampm: "AM" };
  });

  const updateTimeValue = (field, newValue) => {
    const updatedTime = { ...timeValue, [field]: newValue };
    setTimeValue(updatedTime);

    // Convert to 24-hour format for the input value
    let hours24 = parseInt(updatedTime.hours);
    if (updatedTime.ampm === "PM" && hours24 !== 12) {
      hours24 += 12;
    } else if (updatedTime.ampm === "AM" && hours24 === 12) {
      hours24 = 0;
    }

    const timeString = `${hours24.toString().padStart(2, "0")}:${
      updatedTime.minutes
    }`;
    onChange?.({ target: { value: timeString, name: rest.name } });
  };

  const adjustTime = (field, increment) => {
    let newValue;
    if (field === "hours") {
      let hours = parseInt(timeValue.hours);
      hours += increment;
      if (hours > 12) hours = 1;
      if (hours < 1) hours = 12;
      newValue = hours.toString().padStart(2, "0");
    } else if (field === "minutes") {
      let minutes = parseInt(timeValue.minutes);
      minutes += increment * 5; // Increment by 5 minutes
      if (minutes >= 60) minutes = 0;
      if (minutes < 0) minutes = 55;
      newValue = minutes.toString().padStart(2, "0");
    } else if (field === "ampm") {
      newValue = timeValue.ampm === "AM" ? "PM" : "AM";
    }
    updateTimeValue(field, newValue);
  };

  const handleTimeInputChange = (field, inputValue) => {
    // Allow free typing - don't restrict or format while user is typing
    setTimeValue((prev) => ({ ...prev, [field]: inputValue }));

    // Clear any previous errors for this field
    setTimeError((prev) => ({ ...prev, [field]: null }));
  };

  const handleTimeInputBlur = (field) => {
    // Only validate and format when the field loses focus
    if (field === "hours") {
      if (timeValue.hours === "") {
        // Empty value defaults to 12
        updateTimeValue(field, "12");
        return;
      }

      if (/^\d+$/.test(timeValue.hours)) {
        const hourValue = parseInt(timeValue.hours);
        if (hourValue > 23) {
          // Invalid hour, set to default
          setTimeError((prev) => ({ ...prev, hours: "Invalid hour (0-23)" }));
          // Keep the user's input for now to allow correction
        } else if (hourValue > 12) {
          // Convert to 12-hour format
          const hour12 = hourValue % 12 || 12;
          updateTimeValue("hours", hour12.toString().padStart(2, "0"));
          updateTimeValue("ampm", "PM");
        } else if (hourValue === 0) {
          // Handle midnight specially
          updateTimeValue("hours", "12");
          updateTimeValue("ampm", "AM");
        } else {
          // Valid hour 1-12, just format
          updateTimeValue(field, hourValue.toString().padStart(2, "0"));
        }
      } else {
        // Non-numeric input - show error but keep the value
        setTimeError((prev) => ({
          ...prev,
          hours: "Please enter numbers only",
        }));
      }
    } else if (field === "minutes") {
      if (timeValue.minutes === "") {
        // Empty value defaults to 00
        updateTimeValue(field, "00");
        return;
      }

      if (/^\d+$/.test(timeValue.minutes)) {
        const minuteValue = parseInt(timeValue.minutes);
        if (minuteValue > 59) {
          // Invalid minute - show error but keep value
          setTimeError((prev) => ({
            ...prev,
            minutes: "Invalid minute (0-59)",
          }));
        } else {
          // Valid minute 0-59, format with leading zero
          updateTimeValue(field, minuteValue.toString().padStart(2, "0"));
        }
      } else {
        // Non-numeric input - show error but keep the value
        setTimeError((prev) => ({
          ...prev,
          minutes: "Please enter numbers only",
        }));
      }
    }
  };

  const handleTimePopoverOpen = (open) => {
    setIsTimePopoverOpen(open);
    if (open) {
      // Focus the input when popover opens
      setTimeout(() => {
        const inputElement = document.getElementById(id || inputProps.id);
        if (inputElement) {
          inputElement.focus();
          setIsFocused(true);
        }
      }, 100);
    }
  };

  // Function to start editing a time field
  const startEditing = (field) => {
    setEditingField(field);
  };

  // Function to finish editing a time field
  const finishEditing = (field) => {
    setEditingField(null);
    handleTimeInputBlur(field);
  };

  // Calculate right padding based on number of icons
  const rightIconsCount =
    (helpText ? 1 : 0) + (error ? 1 : 0) + 1 + rightItems.length; // +1 for clock icon

  const rightPadding =
    rightIconsCount > 0
      ? `pr-${Math.min(rightIconsCount * 8 + 4, 24)}`
      : "pr-4";

  return (
    <div className="space-y-1" {...containerProps}>
      <div className="relative w-full">
        <Input
          id={id || inputProps.id}
          required={required}
          value={value}
          type="text"
          readOnly
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            "w-full h-14 pt-6 pb-2 transition-all duration-200 text-base cursor-pointer",
            icon ? "pl-12" : "pl-4",
            rightPadding,
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          onClick={() => setIsTimePopoverOpen(true)}
          {...inputProps}
          {...rest}
        />

        {icon && (
          <div className="absolute left-3.5 top-3/7 -translate-y-1/2 h-3 w-3 text-muted-foreground flex-shrink-0 scale-75">
            {icon}
          </div>
        )}

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Custom right items */}
          {rightItems.map((item, index) => (
            <div
              key={index}
              className="h-6 w-6 flex items-center justify-center"
            >
              {item}
            </div>
          ))}

          {/* Time picker trigger */}
          <Popover
            open={isTimePopoverOpen}
            onOpenChange={handleTimePopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-transparent opacity-75 hover:opacity-100 transition-opacity"
                tabIndex={-1}
              >
                <Clock className="h-3 w-3 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end" sideOffset={8}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium">Select Time</h4>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Hours */}
                  <div className="flex flex-col items-center space-y-2 col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="p-0 w-12 rounded-sm"
                      onClick={() => adjustTime("hours", 1)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>

                    {editingField === "hours" ? (
                      <div className="relative">
                        <Input
                          type="text"
                          value={timeValue.hours}
                          onChange={(e) =>
                            handleTimeInputChange("hours", e.target.value)
                          }
                          onBlur={() => finishEditing("hours")}
                          autoFocus
                          className="text-3xl font-mono w-12 h-12 text-center border-0 bg-transparent p-0 focus-visible:ring-1"
                          maxLength={2}
                          placeholder="12"
                        />
                        {timeError.hours && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-destructive text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {timeError.hours}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="text-3xl font-mono w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-muted transition-colors rounded"
                        onClick={() => startEditing("hours")}
                      >
                        {timeValue.hours}
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="p-0 w-12 rounded-sm"
                      onClick={() => adjustTime("hours", -1)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Separator */}
                  <div className="flex items-center justify-center col-span-1">
                    <div className="text-2xl font-mono h-12 flex items-center justify-center">
                      :
                    </div>
                  </div>

                  {/* Minutes */}
                  <div className="flex flex-col items-center space-y-2 col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="p-0 w-12 rounded-sm"
                      onClick={() => adjustTime("minutes", 1)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>

                    {editingField === "minutes" ? (
                      <div className="relative">
                        <Input
                          type="text"
                          value={timeValue.minutes}
                          onChange={(e) =>
                            handleTimeInputChange("minutes", e.target.value)
                          }
                          onBlur={() => finishEditing("minutes")}
                          autoFocus
                          className="text-3xl font-mono w-12 h-12 text-center border-0 bg-transparent p-0 focus-visible:ring-1"
                          maxLength={2}
                          placeholder="00"
                        />
                        {timeError.minutes && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-destructive text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {timeError.minutes}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="text-3xl font-mono w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-muted transition-colors rounded"
                        onClick={() => startEditing("minutes")}
                      >
                        {timeValue.minutes}
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="p-0 w-12 rounded-sm"
                      onClick={() => adjustTime("minutes", -1)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* AM/PM */}
                  <div className="flex flex-col items-center space-y-2 col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="p-0 w-12 rounded-sm"
                      onClick={() => adjustTime("ampm")}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <div
                      className="text-3xl font-mono w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-muted transition-colors rounded"
                      onClick={() => adjustTime("ampm")}
                    >
                      {timeValue.ampm}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="p-0 w-12 rounded-sm"
                      onClick={() => adjustTime("ampm")}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={() => setIsTimePopoverOpen(false)}
                  className="w-full"
                  size={"sm"}
                >
                  Confirm
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {helpText && (
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
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {error && (
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

        {label && (
          <Label
            htmlFor={id || inputProps.id}
            {...labelProps}
            className={cn(
              "absolute transition-all duration-200 pointer-events-none text-muted-foreground",
              icon ? "left-12" : "left-4",
              isFloating
                ? "top-1.5 text-xs font-medium"
                : "top-1/2 -translate-y-1/2 text-sm",
              isFocused && "text-primary",
              error && "text-destructive",
              labelProps?.className
            )}
          >
            {label}
            {required && " *"}
          </Label>
        )}
      </div>
    </div>
  );
}

export default TimeField;
